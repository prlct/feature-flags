import Quill from 'quill';

const BlotEmbed = Quill.import('blots/embed');

export default class Signature extends BlotEmbed {
  static blotName = 'signature';

  static tagName = 'gfs';

  static varUtilStore = { classes: { variable: '' } };

  static create() {
    const { classes } = Signature.varUtilStore;
    const node = super.create();
    node.innerText = '{{signature}}';
    node.className = classes.variable;
    node.contentEditable = false;
    return node;
  }

  static value(node) {
    return {
      value: node.innerText || null,
    };
  }

  static formats() {
    return true;
  }
}
