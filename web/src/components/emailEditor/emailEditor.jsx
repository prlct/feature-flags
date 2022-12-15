/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { nanoid } from 'nanoid';
import clsx from 'clsx';

import { InputBase, FileButton } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import dynamic from 'next/dynamic';

import { UploadHTML } from 'public/icons';
import { IconCirclePlus } from '@tabler/icons';
import { useStyles } from './emailEditor.styles';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

RegExp.escape = (s) => s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');

const formats = [
  'size', 'bold', 'italic', 'underline',
  'link', 'image', 'video', 'color', 'background',
  'list', 'bullet',
  'indent', 'align',
  ['button'], 'code-block',
];

const EmailEditor = ({ subject, body, setSubject, setBody }) => {
  const { classes } = useStyles();

  useEffect(() => {
    const getQuillBlots = async () => {
      const ReactQuill = (await import('react-quill')).default;
      const Inline = ReactQuill.Quill.import('blots/inline');
      class ButtonBlot extends Inline {
        static create(value) {
          const node = super.create(value);
          node.setAttribute('style', 'padding:8px 20px;border-radius:12px;border: none;');
          return node;
        }
      }
      ButtonBlot.blotName = 'button';
      ButtonBlot.tagName = 'button';
      ButtonBlot.className = 'button-styles';
      ReactQuill.Quill.register('formats/button', ButtonBlot);
      return ReactQuill.Quill;
    };
    getQuillBlots();
  }, []);

  const editorId = React.useMemo(() => `q${nanoid()}`, []);
  const modules = React.useMemo(() => ({
    toolbar: `#${editorId}`,
    clipboard: {
      matchVisual: false,
    },
  }), [editorId]);

  function readFile(uploadFile) {
    const file = uploadFile;

    const reader = new FileReader();

    reader.readAsText(file);

    reader.onload = () => {
      setBody(reader.result.toString());
      showNotification({
        title: 'Template uploaded',
        message: 'Template successfully uploaded',
        color: 'green',
      });
    };

    reader.onerror = () => {
      showNotification({
        title: 'Error',
        message: 'Failed to load template',
        color: 'red',
      });
    };
  }

  return (
    <div className={classes.root}>
      <div className={classes.subject}>
        <div className={classes.subjectInputWrap}>
          <InputBase
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className={classes.subjectInput}
            placeholder="Subject"
            variant="outlined"
            minLength="1"
          />
        </div>
      </div>
      <div className={classes.quillWrap}>
        <ReactQuill
          theme="snow"
          value={body}
          onChange={setBody}
          placeholder="Body"
          formats={formats}
          modules={modules}
          style={{
            minHeight: 300,
          }}
        />
      </div>
      <div className={classes.separator} />
      <div className={classes.toolbar}>
        <div id={editorId} className={clsx(classes.quillControls, 'email-editor')}>
          <select className="ql-size" />
          <button type="button" className="ql-bold" />
          <button type="button" className="ql-italic" />
          <button type="button" className="ql-underline" />
          <button type="button" className="ql-link" />
          <button type="button" className="ql-image" />
          <button type="button" className="ql-video" />
          <select className="ql-color" />
          <select className="ql-background" />
          <button type="button" className="ql-list" value="ordered" />
          <button type="button" className="ql-list" value="bullet" />
          <button type="button" className="ql-indent" value="-1" />
          <button type="button" className="ql-indent" value="+1" />
          <button type="button" className="ql-align" value="" />
          <button type="button" className="ql-align" value="center" />
          <button type="button" className="ql-align" value="right" />
          <button type="button" className="ql-align" value="justify" />
          <button type="button" className="ql-button"><IconCirclePlus /></button>
          <button type="button" className="ql-code-block" />
          <FileButton onChange={(value) => readFile(value)} accept="text/html">
            {(props) => <button type="button" {...props}><UploadHTML /></button>}
          </FileButton>
        </div>
      </div>
    </div>
  );
};

EmailEditor.propTypes = {
  subject: PropTypes.string.isRequired,
  setSubject: PropTypes.func.isRequired,
  body: PropTypes.string.isRequired,
  setBody: PropTypes.func.isRequired,
};

export default EmailEditor;
