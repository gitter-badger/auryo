import {initUser, logout, toggleFollowing} from "./userActions";
import {fetchMore} from "./objectActions";
import {playTrack, toggleStatus, changeTrack, setCurrentTime} from "./playerActions";
import {fetchTrackIfNeeded, toggleLike} from "./trackActions";


export {
    initUser,
    playTrack,
    toggleStatus,
    setCurrentTime,
    changeTrack,
    fetchMore,
    logout,
    fetchTrackIfNeeded,
    toggleLike,
    toggleFollowing
};
