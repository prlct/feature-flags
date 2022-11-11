import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Delete from '@material-ui/icons/Delete';
import { withStyles } from '@material-ui/core/styles';
import styles from './variables.styles';

class Variables extends React.Component {
  state = {
    linkVars: [],
  }

  componentDidMount = async () => {
    const { variables } = this.props;
    const linkVars = variables.filter(v => v.url).map(v => v.name);
    this.setState({
      linkVars,
    });
  }

  onVariableChange = variableName => (e) => {
    const { onVariableChange } = this.props;
    onVariableChange(variableName, { value: e.target.value });
  }

  onVariableUrlChange = variableName => (e) => {
    const { onVariableChange } = this.props;
    onVariableChange(variableName, { url: e.target.value });
  }

  onKeyDown = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
    }
  }

  onVariableDelete = variable => () => {
    const { onVariableDelete } = this.props;
    onVariableDelete(variable);
  }

  onLinkAdd = variableName => () => {
    this.setState(({ linkVars }) => ({
      linkVars: [
        ...linkVars,
        variableName,
      ],
    }));
  }

  render() {
    const {
      classes,
      variables,
      enableDelete,
      className,
      enableDescription,
      embedded,
    } = this.props;
    const { linkVars } = this.state;

    const noDelete = !enableDelete || variables.every(v => v.cantDelete);
    const noDescription = !enableDescription || variables.every(v => !v.description);

    return (
      <div className={classnames({ [classes.root]: !embedded }, className)}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                Name
              </TableCell>
              {!noDescription && (
                <TableCell className={classes.descriptionCell}>
                  Description
                </TableCell>
              )}
              <TableCell>
                Value
              </TableCell>
              {!noDelete && (
                <TableCell className={classes.buttonCell} />
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {variables.map(v => (
              <TableRow key={v.name}>
                <TableCell className={classes.nameCell}>
                  {`${v.name}`}
                </TableCell>
                {!noDescription && (
                  <TableCell className={classes.descriptionCell}>
                    {v.description}
                  </TableCell>
                )}
                <TableCell className={classes.valueCell}>
                  {linkVars.includes(v.name) ? (
                    <div className={classes.inputWrap}>
                      <TextField
                        onChange={this.onVariableChange(v.name)}
                        onKeyDown={this.onKeyDown}
                        multiline
                        rows={2}
                        fullWidth
                        value={v.value || ''}
                        placeholder="Value"
                        className={classes.withLinkInput}
                      />
                      <TextField
                        onChange={this.onVariableUrlChange(v.name)}
                        onKeyDown={this.onKeyDown}
                        multiline
                        rows={2}
                        fullWidth
                        value={v.url || ''}
                        placeholder="e.x.: https://www.funnelfly.com"
                        className={classes.withLinkInput}
                      />
                    </div>
                  ) : (
                    <div className={classes.inputWrap}>
                      <TextField
                        onChange={this.onVariableChange(v.name)}
                        onKeyDown={this.onKeyDown}
                        multiline
                        rows={2}
                        className={classes.noLinkInput}
                        value={v.value || ''}
                      />
                      <button type="button" className={classes.addLinkButton} onClick={this.onLinkAdd(v.name)}>
                        Add link
                      </button>
                    </div>
                  )}
                </TableCell>
                {!noDelete && (
                  <TableCell className={classes.buttonCell}>
                    {!v.cantDelete && (
                      <IconButton onClick={this.onVariableDelete(v.name)}><Delete /></IconButton>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }
}

Variables.propTypes = {
  classes: PropTypes.shape().isRequired,
  variables: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  onVariableChange: PropTypes.func.isRequired,
  onVariableDelete: PropTypes.func,
  enableDelete: PropTypes.bool,
  enableDescription: PropTypes.bool,
  className: PropTypes.string,
  embedded: PropTypes.bool,
};

Variables.defaultProps = {
  enableDelete: true,
  enableDescription: true,
  onVariableDelete: () => null,
  className: null,
  embedded: false,
};

export default withStyles(styles)(Variables);
