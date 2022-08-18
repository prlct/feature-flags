import { memo, useState } from 'react';
import { Group, Text, Button } from '@mantine/core';
import { handleError } from 'helpers';
import { adminApi } from 'resources/admin';
import { AddIcon, PenIcon } from 'public/icons';

import { useStyles } from './styles';

const PhotoUpload = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const { classes, cx } = useStyles();

  const { data: currentAdmin } = adminApi.useGetCurrent();

  const { mutate: uploadProfilePhoto } = adminApi.useUploadProfilePhoto({
    onError: (err) => handleError(err),
  });
  const { mutate: removeProfilePhoto } = adminApi.useRemoveProfilePhoto({
    onError: (err) => handleError(err),
  });

  const isFileSizeCorrect = (file) => {
    const oneMBinBytes = 1048576;
    if ((file.size / oneMBinBytes) > 2) {
      setErrorMessage('Sorry, you cannot upload a file larger than 2 MB.');
      return false;
    }
    return true;
  };

  const isFileFormatCorrect = (file) => {
    if (['image/png', 'image/jpg', 'image/jpeg'].includes(file.type)) return true;
    setErrorMessage('Sorry, you can only upload JPG, JPEG or PNG photos.');
    return false;
  };

  const handlePhotoUpload = async (e) => {
    const imageFile = e.target.files[0];

    setErrorMessage(null);

    if (isFileFormatCorrect(imageFile) && isFileSizeCorrect(imageFile) && imageFile) {
      const body = new FormData();
      body.append('file', imageFile, imageFile.name);

      await uploadProfilePhoto(body, {
        onError: (err) => handleError(err),
      });
    }
  };

  const handlerPhotoRemove = async () => {
    setErrorMessage(null);
    await removeProfilePhoto();
  };

  return (
    <>
      <Text weight={500}>Profile picture</Text>
      <Group align="center">
        <label
          className={cx(classes.browseButton, {
            [classes.error]: errorMessage,
          })}
        >
          {currentAdmin.avatarUrl ? (
            <div
              className={classes.avatar}
              style={{
                backgroundImage: `url(${currentAdmin.avatarUrl}`,
              }}
            >
              <div className={classes.innerAvatar}>
                <PenIcon />
              </div>
            </div>
          )
            : <AddIcon className={classes.addIcon} />}
          <input
            name="avatarUrl"
            style={{ display: 'none' }}
            type="file"
            onChange={handlePhotoUpload}
          />
        </label>
        <span className={classes.buttonContainer}>
          <p className={classes.text}>
            JPG, JPEG or PNG
            Max size = 2MB
          </p>
          {currentAdmin.avatarUrl && (
            <Button
              type="submit"
              variant="subtle"
              className={classes.removeButton}
              onClick={handlerPhotoRemove}
              size="sm"
            >
              Remove
            </Button>
          )}
        </span>
      </Group>
      {errorMessage ? <p className={classes.errorMessage}>{errorMessage}</p> : null}
    </>
  );
};

export default memo(PhotoUpload);
