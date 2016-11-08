import React from "react";
// Simplified component
class Search extends React.Component {
  render() {
    return (
      <form
        onSubmit={this.props.handleSubmit}>
        {/* Notice how values and callbacks are passed in using props */}
        <input type="text"
               value={this.props.searchValue}
               onChange={this.props.handleChange}/>
        <input type="submit"/>
      </form>
    );
  }
}

export default Search
