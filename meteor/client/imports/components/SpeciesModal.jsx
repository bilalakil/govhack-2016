import React from 'react';

const descriptionItemBlacklist = [
    //'Brief description'
];

const DescriptionItem = (props) => {
    return (
        <div className="ui basic segment">
            <h3 className="ui header">{props.section}</h3>
            <p>{props.content}</p>
        </div>
    );
};

class SpeciesModalInner extends React.Component {
    constructor(props) {
        super(props);
        this.whitelistedContent = this.whitelistedContent.bind(this);
    }

    componentDidMount() {
        $(this.tabMenu).find('.item').tab({
            onVisible() {
                $('#speciesModal').modal('refresh');
            }
        });
    }

    whitelistedContent() {
        return this.props.content.filter((item) => {
            return (descriptionItemBlacklist.indexOf(item.section) === -1);
        });
    }

    render() {
        console.log(this.props);
        return (
            <div className="content">
                <div className="ui tabular menu" ref={(ref) => this.tabMenu = ref}>
                    <div className="active item" data-tab="gallery">Gallery</div>
                    <div className="item" data-tab="details">Details</div>
                </div>
                <div className="ui active tab" data-tab="gallery">
                    <div className="speciesImage" style={{backgroundImage: `url('${this.props.imageUrl}')`}}></div>
                </div>
                <div className="ui tab" data-tab="details">
                    {this.whitelistedContent().map((item, index) => <DescriptionItem key={index} {...item}/>)}
                </div>
            </div>
        );
    }
}

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
        console.log(this.props)
        if (Meteor.userId()) {
            Meteor.call('markSpeciesAsSeen', this.props.speciesId, this.props.speciesName, this.props.speciesImageUrl);
        } else {
            this.closeModal();
            FlowRouter.go('/sign-in');
        }
    },

    render() {
        return (
            <div id="speciesModal" className="ui long modal" ref={(ref) => this.modal = ref}>
                <i className="close icon" onClick={(evt) => this.closeModal(evt)}></i>
                <div className="header">
                    {this.props.speciesName}
                </div>
                {this.state.loading ? <div className="ui active inline centered loader"></div> : <SpeciesModalInner imageUrl={this.props.speciesImageUrl} {...this.state.data} /> }
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
                </div>
            </div>
        )
    }
});

export default React.createClass({
    mixins: [ReactMeteorData],
    getMeteorData() {
        return {
            speciesId: Session.get('watchingSpeciesId'),
            speciesName: Session.get('watchingSpeciesName'),
            speciesImageUrl: Session.get('watchingSpeciesImageUrl')

        };
    },
    render() {
        return <SpeciesModal {...this.data}/>
    }
});
