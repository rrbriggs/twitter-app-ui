import React from 'react';
import {userTimelineReq} from '../TimelineReq';
import PostFactoryComponent from './PostFactoryComponent';
import {displayNameOfNode} from "enzyme/src/Utils";

class UserTimelineComponent extends React.Component {
    constructor(props) {
        super(props);

        this.userButtonClick = this.userButtonClick.bind(this);
        this.prevUserData = null;

        this.state = { 
            userData: [],
            hasError: false,
            errorMsg: null
        }
    }

    componentDidMount() {
        this.requestUserTimeline();
    }

    async requestUserTimeline() {

        const userData = await userTimelineReq();

        if (!(userData instanceof Error)) {
            if (userData != this.prevUserData) {
                this.prevUserData = userData;
                this.setState({
                    userData: userData
                });
            }
        } else {
            this.prevUserData = "";
            this.setState({
                userData: null,
                errorMsg: userData.message
            });
        }
    }

    userButtonClick() {
        this.requestUserTimeline();
    }

    userTimeline() {
        try {
            let userTimeCount = 0;
            if (this.state.userData != null) {
                return (
                    this.state.userData.map((post) => {
                        if(post != "") {
                            let postOddity = ((userTimeCount % 2 == 0) ? 'evenUserPost' : 'oddUserPost');
                            userTimeCount++;
                            return <PostFactoryComponent key={post.postID + 1} postID={post.postID} photoURL={post.socialUser.profileImageUrl} screenName={post.socialUser.name} userHandle={post.socialUser.twitterHandle} date={post.createdAt} statusMessage={post.message} postStyle={postOddity} userTimeline={true}/>
                        }
                    })
                );
            } else {
                return <div className='error'>{this.state.errorMsg}</div>
            }
        } catch {
            return <div className='error'>{this.state.errorMsg}</div>
        }

    }

    render() {
        return(
            <div id='userTimeline' className='userTimeline'>
                <div className='userInfoContainer'>
                    <button id="getUserTimelineButton" onClick={this.userButtonClick} className='button'>Refresh</button>
                </div>
                {this.userTimeline()} 
            </div>
        );
    }
}

export default UserTimelineComponent;