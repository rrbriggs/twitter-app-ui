import React from 'react';
import {timelineReq} from '../TimelineReq';
import {filteredHomeTimeline} from '../TimelineReq';
import PostFactoryComponent from './PostFactoryComponent';

class HomeTimelineComponent extends React.Component {
    constructor(props) {
        super(props);

        this.homeButtonClick = this.homeButtonClick.bind(this);
        this.handleHomeFilterChange = this.handleHomeFilterChange.bind(this);
        this.handleHomeFilterKeyPress = this.handleHomeFilterKeyPress.bind(this);
        this.getFilteredResults = this.getFilteredResults.bind(this);
        this.prevData = null;

        this.state = {
            loading: true,
            filter: "",
            data: {},
            filterNoData: null,
            errorMsg: null,
        };

        this.processTimeline = (obj) => {
            if (obj != this.prevData) {
                this.prevData = obj;
                this.setState({
                    data: obj
                }); 
            } 
        }
    }

    componentDidMount() {
        this.requestTimeline();
    }

    async requestTimeline() {
        const data = await timelineReq();
        if (!(data instanceof Error)) {
            this.processTimeline(data);
            this.setState({loading: false});
        } else {
            this.prevData = "";
            this.setState({
                data: null,
                loading: false,
                errorMsg: data.message
            });
        }
    }

    homeButtonClick() {
        this.requestTimeline();
    }

    homeTimeline() {
        try{
            let count = 0;
            if (this.state.data != null && this.state.loading === false) {
                return (
                    this.state.data.map((post) => {
                        if(post != "") {
                            let postOddity = ((count % 2 == 0) ? 'evenPostBlock' : 'oddPostBlock');
                            count++;
                            return <PostFactoryComponent
                                key={post.postID + 1}
                                postID={post.postID}
                                photoURL={post.socialUser.profileImageUrl}
                                screenName={post.socialUser.name}
                                userHandle={post.socialUser.twitterHandle}
                                date={post.createdAt}
                                statusMessage={post.message}
                                postStyle={postOddity}
                            />
                        }
                    })
                );
            } else {
                return <div className='error'>{this.state.errorMsg}</div>
            }
        } catch {
            if (this.state.loading === false) {
                    return <div className='error'>{this.state.errorMsg}</div>
            }
        }
    }

    handleHomeFilterChange(e) {
        this.setState({ filter: e.target.value});
    }

    handleHomeFilterKeyPress(e) {
        if (e.key == "Enter" && this.state.filter.valueOf()) {
            this.getFilteredResults();
        }
    }

    async getFilteredResults() {
        this.setState({
            data: null,
        });

        try {
            const data = await filteredHomeTimeline(this.state.filter.toLowerCase());
            if (!(data instanceof Error)) {
                this.processTimeline(data);
            } else {
                this.prevData = "";
                this.setState({
                    loading: false,
                    data: null,
                    errorMsg: data.message
                });
            }
        } catch {
            this.prevData = "";
            this.setState({
                data: null,
                errorMsg: data.message
            });
        }
    }

    render() {
        return(
            <div id='homeTimeline' className='homeTimeline'>
                <div className='infoContainer'>
                    <div className='infoInner'>
                        <input id="filterHome"
                               type="text"
                               placeholder="Enter filter query."
                               value={this.state.filter}
                               onChange={this.handleHomeFilterChange}
                               onKeyPress={this.handleHomeFilterKeyPress}
                        />

                        <button id="filterHomeButton"
                                type="button"
                                onClick={this.getFilteredResults}
                                disabled={(this.state.filter)? false : true}>
                                    Filter
                        </button>

                    </div>
                    <button id="getTimelineButton" onClick={this.homeButtonClick} className='button'>Refresh</button>
                </div>
                {this.homeTimeline()} 
            </div>
        );
    }
}

export default HomeTimelineComponent;