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
        if (nextProps.speciesId) {
            this.setState({loading: true});

            const httpUrl = `${Meteor.settings.public.apiUrl}/species/${nextProps.speciesId}`;
            console.log(httpUrl);

            HTTP.call(
                'get',
                httpUrl,
                (err, res) => {
                    if (err || res.statusCode !== 200) {
                        console.error('Error getting species data');
                        console.error(err);
                        this.setState({loading: false, hasError: true});
                    } else {
                        console.log('got DATA');
                        console.log(res);
                        this.setState({loading: false, data: res.data});
                    }
                }
            );
        }
    },

    closeModal(evt) {
        if (evt) evt.preventDefault();
        this.$modal.modal('hide');
    },

    hasSeen() {
        return (this.data.user && this.data.user.profile && this.data.user.profile.speciesSeen && this.data.user.profile.speciesSeen.indexOf(this.props.speciesId) > -1);
    },

    markAsSeen() {
        if (Meteor.userId()) {
            Meteor.call('markSpeciesAsSeen', this.props.speciesId);
        } else {
            this.closeModal();
            FlowRouter.go('/sign-in');
        }
    },

    render() {
        return (
            <div id="speciesModal" className="ui modal" ref={(ref) => this.modal = ref}>
                <i className="close icon" onClick={(evt) => this.closeModal(evt)}></i>
                <div className="header">
                    {this.props.speciesName}
                </div>
                <div className="content">
                    {(() => {
                        if (this.hasSeen()) {
                            return (
                                <button className="ui positive fluid left icon labeled button">
                                    <i className="eye icon"></i>
                                    Seen it!
                                </button>
                            );
                        } else  {
                            return (
                                <button className="ui primary fluid left icon labeled button" onClick={(evt) => this.markAsSeen(evt)}>
                                    <i className="eye icon"></i>
                                    Mark as seen
                                </button>
                            )
                        }
                    })()}
                    {this.state.loading ? <div className="ui active inline centered loader"></div> : JSON.stringify(this.state.data)}
                </div>
            </div>
        )
    }
});

export default React.createClass({
    mixins: [ReactMeteorData],
    getMeteorData() {
        return {
            watchingSpeciesId: Session.get('watchingSpeciesId'),
            watchingSpeciesName: Session.get('watchingSpeciesName')
        };
    },
    render() {
        return <SpeciesModal speciesId={this.data.watchingSpeciesId} speciesName={this.data.watchingSpeciesName}/>
    }
});