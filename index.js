import React from 'react';
import classnames from 'classnames';
import lodash from 'lodash';
import axios from 'axios';

const ITEMS_API_URL = 'https://example.com/api/items';
const DEBOUNCE_DELAY = 500;

export default function Autocomplete({ onSelectItem }) {
  const [itemName, setItemName] = React.useState('');
  const [suggestions, setSuggestions] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    getItemsSuggestion();

    return getItemsSuggestion.cancel;
  }, [itemName, getItemsSuggestion]);

  const getItemsSuggestion = React.useCallback(lodash.debounce(async () => {
    if (itemName === '') return setSuggestions([]);

    setIsLoading(true);
    
    try {
      const { data } = await axios.get(ITEMS_API_URL, { params: { q: itemName } });
      setSuggestions(data);
    } catch (err) {
      setSuggestions([]);
    }

    setIsLoading(false);
  }, 500), [itemName])

  return (
    <div className="wrapper">
      <div className={classnames('control', { 'is-loading': isLoading })}>
        <input
          type="text"
          className="input"
          onChange={(e) => setItemName(e.target.value)}
          value={itemName}
        />
      </div>
      {suggestions.length > 0 && !isLoading && (<div className="list is-hoverable">
        {suggestions.map(suggestion => (
          <a className="list-item" onClick={() => onSelectItem(suggestion)}>{suggestion}</a>
        ))}
      </div>)}
    </div>
  );
}
