import React, { Component } from 'react';
import { withStyles } from '@mui/styles';
import PropTypes from 'prop-types';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';

import IconCancel from '@mui/icons-material/Close';
import IconCheck from '@mui/icons-material/Check';

const styles = theme => ({
    input: {
        marginBottom: theme.spacing(2),
    },
    inputText: {
        width: 400,
        height: 300,
        marginBottom: theme.spacing(2),
    },
    formControl: {
        marginBottom: theme.spacing(2),
        minWidth: 150,
    },
    quality: {
        width: '100%'
    }
});

class ObjectBrowserEditRole extends Component {
    constructor(props) {
        super(props);

        this.state = {
            role: null,
            initRole: null,
            roleInput: null
        };
    }

    componentDidMount() {
        this.props.socket.getObject(this.props.id)
            .then(obj => {
                this.object = obj;
                const value = obj?.common?.role || null;
                this.setState({ role: value, initRole: value, roleInput: value });
            })
            .catch(e => console.error(e));
    }

    onUpdate() {
        this.object.common = this.object.common || {};
        this.object.common.role = this.state.roleInput;
        this.props.socket.setObject(this.object._id, this.object)
            .then(() => this.props.onClose(this.object));
    }

    render() {
        return <Dialog
            key="objectBrowserEditRole"
            open={true}
            maxWidth="sm"
            fullWidth={true}
            onClose={() => this.props.onClose()}
            aria-labelledby="edit-role-dialog-title"
            aria-describedby="edit-role-dialog-description"
        >
            <DialogTitle id="edit-role-dialog-title">{this.object ? this.props.t('Update role for %s', this.object._id) : null}</DialogTitle>
            <DialogContent>
                <Autocomplete
                    freeSolo
                    options={this.props.roles}
                    style={{ width: '100%' }}
                    value={this.state.role}
                    onChange={(event, role) => this.setState({ role, roleInput: role })}
                    onInputChange={(event, role) => this.setState({ roleInput: role })}
                    renderInput={params => <TextField
                        {...params}
                        label={this.props.t('Role')}
                        variant="outlined"
                    />}
                />
            </DialogContent>
            <DialogActions>
                <Button disabled={this.state.initRole === this.state.roleInput} variant="contained" onClick={() => this.onUpdate()} color="primary" startIcon={<IconCheck />}>{this.props.t('Apply')}</Button>
                <Button variant="contained" onClick={() => this.props.onClose()} color="grey" startIcon={<IconCancel />}>{this.props.t('Cancel')}</Button>
            </DialogActions>
        </Dialog>;
    }
}

ObjectBrowserEditRole.propTypes = {
    classes: PropTypes.object,
    roles: PropTypes.array,
    id: PropTypes.string,
    socket: PropTypes.object,
    onClose: PropTypes.func.isRequired,

    t: PropTypes.func,
};

export default withStyles(styles)(ObjectBrowserEditRole);
