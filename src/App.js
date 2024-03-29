import React, {Component} from 'react';
import './App.css';

const DEFAULT_QUERY = 'redux';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';

class App extends Component {

  // Lifecycle Component methods
  constructor(props){
    super(props);
    this.state = {
      result: null,
      searchTerm: DEFAULT_QUERY,
    };
  }
  
  componentDidMount = () => {
    this.fetchSearchTopStories(this.state.searchTerm);
  }

  render(){
    const {searchTerm, result } = this.state;

    return (
      <div className="page">
        <div className="interactions">
          <Search value={searchTerm} 
                  onChange={this.onSearchChange}
                  onSubmit={this.onSearchSubmit}> Search </Search>
                  
        </div>
        { result && <Table list={result.hits} 
                           onDismiss={this.onDismiss} />}
      </div>
    );
  }
  
  // Defined Interface
  onDismiss = (id) => {
    const isNotID = item => item.objectID !== id;
    const updatedHits = this.state.result.hits.filter(isNotID);
    this.setState({
      result: {...this.state.result, hits: updatedHits} 
    });
  }
  
  onSearchChange = (event) => {
   this.setState({searchTerm: event.target.value}); 

  }
  
  onSearchSubmit = (event) => {
    const { searchTerm } = this.state
    
    this.fetchSearchTopStories(searchTerm);

    event.preventDafault();
  }

  setSearchTopStories = (result) => {
    this.setState({result});
  }

  fetchSearchTopStories = (searchTerm) => {
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .catch(error => error);
  }

}

const Search = ({value, onChange, onSubmit, children}) =>
    <form onSubmit={onSubmit}>
      <input
        type="text"
        value={value}
        onChange={onChange}
      />
      <button type="submit">
        {children}
      </button>
    </form>

const Table = ({list, onDismiss}) =>
      <div className="table">
        {list.map(item =>
          <div key={item.objectID} className="table-row">
            <span style={{ width: '25%'}}> <a href={item.url}>{item.title}</a> </span>
            <span style={{ width: '45%'}}> {item.author}</span>
            <span style={{ width: '10%'}}> {item.num_comments}</span>
            <span style={{ width: '10%'}}> {item.points}</span>
            <span style={{ width: '10%'}}>
              <Button
                onClick = { ()=> onDismiss(item.objectID)} className="button-inline">
                Dismiss
              </Button>
            </span>
          </div>)}
      </div> 

const Button = ({onClick, className="", children} ) =>
      <button
        type="button"
        onClick={onClick}
        className = {className}>
          {children}
      </button>


export default App;
