import React from 'react';

const SpeciesModal = React.createClass({
    mixins: [ReactMeteorData],

    getMeteorData() {
        return {
            user: Meteor.user()
        }
    },

    getInitialState() {
        return {loading: true};
    },

    componentDidMount() {
        this.$modal = $(this.modal);

        this.$modal.modal({
            detachable: false,
            observeChanges: true
        });
    },

    componentWillReceiveProps(nextProps) {
        console.log('getting next props!');
        console.log(nextProps);
        this.setState({loading: true});
        Meteor.setTimeout(() => {
            this.setState({loading: false});
        }, 2000);
    },

    closeModal(evt) {
        evt.preventDefault();
        this.$modal.modal('hide');
    },

    render() {
        return (
            <div id="speciesModal" className="ui modal" ref={(ref) => this.modal = ref}>
                <i className="close icon" onClick={(evt) => this.closeModal(evt)}></i>
                <div className="header">
                    Species modal
                    <button className="ui primary left icon labeled button">
                        <i className="eye icon"></i>
                        Seen it!
                    </button>
                </div>
                <div className="content">
                    {this.state.loading ? <div className="ui active inline centered loader"></div> : this.props.speciesId}
                </div>
            </div>
        )
    }
});

export default React.createClass({
    mixins: [ReactMeteorData],
    getMeteorData() {
        const watchingSpeciesId = Session.get('watchingSpeciesId');
        return {watchingSpeciesId};
    },
    render() {
        return <SpeciesModal speciesId={this.data.watchingSpeciesId}/>
    }
});