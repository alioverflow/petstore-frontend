import React from 'react';
import axios from 'axios';
import qs from 'qs';

function Results({ data }) {
  if (data.length === 0) {
    return 'No Results';
  }

  return (
    <ul>
      {data.map(d => (
        <li key={d.id}>
          {d.id}: {d.name} ({d.tags.map(t => t.name).join(', ')})
        </li>
      ))}
    </ul>
  );
}

function PetsByTags() {
  const [tags, setTags] = React.useState({ 0: '' });

  const onTagChanged = React.useCallback((id, text) => {
    const newTags = { ...tags };
    const tagsLen = Object.keys(newTags).length;

    newTags[id] = text;

    if (tags[id].length === 0) {
      // add a new empty input
      const afterLast = Math.max(Object.keys(newTags)) + 1;
      newTags[afterLast] = '';
    }

    // remove empty inputs, but keep at least one input
    if (text.length === 0 && tagsLen > 1) {
      const lastEmptyId = Object.keys(newTags).findLast(k => k !== id && newTags[k].length === 0);
      delete newTags[lastEmptyId];
    }

    setTags(newTags);
  }, [tags]);

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [data, setData] = React.useState(null);

  const onSubmit = React.useCallback(async (e) => {
    e.preventDefault();

    setLoading(true);
    setError(false);
    setData(null);

    try {
      const tagsFiltered = Object.values(tags).filter(x => x && x.length > 0);
      const res = await axios.get('https://petstore3.swagger.io/api/v3/pet/findByTags', {
        params: { tags: tagsFiltered },
        paramsSerializer: {
          serialize: (params) => qs.stringify(params, { arrayFormat: 'repeat' })
        }
      })
      setData(res.data);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [tags]);

  return (
    <>
      <h1>Pets by Tags</h1>
      <form onSubmit={onSubmit}>
        {Object.entries(tags).map(([k, v]) => (
          <input
            key={k}
            value={v}
            onChange={e => onTagChanged(k, e.target.value)}
          />
        ))}
        <br />
        <input
          type={'submit'}
          value={'Search'}
        />
      </form>
      {loading && 'Loading...'}
      {error && error.toString()}
      {data && <Results data={data} />}
    </>
  );
}

export default PetsByTags;
