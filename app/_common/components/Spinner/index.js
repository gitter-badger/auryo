import React from "react";

class Spinner extends React.Component {
    render() {

        return (
            <div className="loadingWrapper">
                <div className="loading_inner">
                    <ul className="loading">
                        <li/>
                        <li/>
                        <li/>
                        <li/>
                        <li/>
                        <li/>
                        <li/>
                        <li/>
                        <li/>
                        <li/>
                    </ul>
                </div>
            </div>
        );
    }
}

export default Spinner;
