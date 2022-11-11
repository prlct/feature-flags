import React, { useState } from 'react';
import { nanoid } from 'nanoid';
import { useStyles } from './emailEditor.styles';
import clsx from 'clsx';
import { InputBase } from '@mantine/core';
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import 'react-quill/dist/quill.snow.css';

RegExp.escape = (s) => {
  return s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
};

const formats = [
  'bold', 'italic', 'underline', 'link',
  'list', 'bullet',
  'indent', 'align',
];

function EmailEditor() {
  const { classes } = useStyles();
  const [value, setValue] = useState('');

  const editorId = React.useMemo(() => `q${nanoid()}`);
  const modules = React.useMemo(() => {
    return {
      toolbar: `#${editorId}`,
      clipboard: {
        matchVisual: false,
      },
    };
  });

  return (
    <div className={classes.root}>
        <div className={classes.subject}>
          <div className={classes.subjectInputWrap}>
            <InputBase
              required
              // value={subject}
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
            // value={value}
            // onChange={setValue}
            placeholder='Body'
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
            <button type="button" className="ql-bold" />
            <button type="button" className="ql-italic" />
            <button type="button" className="ql-underline" />
            <button type="button" className="ql-link" />
            <button type="button" className="ql-list" value="ordered" />
            <button type="button" className="ql-list" value="bullet" />
            <button type="button" className="ql-indent" value="-1" />
            <button type="button" className="ql-indent" value="+1" />
            <button type="button" className="ql-align" value="" />
            <button type="button" className="ql-align" value="center" />
            <button type="button" className="ql-align" value="right" />
            <button type="button" className="ql-align" value="justify" />
          </div>
        </div>
      </div>
  );
}

export default EmailEditor;

