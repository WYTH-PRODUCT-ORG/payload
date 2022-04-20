import queryString from 'qs';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Where } from '../../../../types';
import useDebounce from '../../../hooks/useDebounce';
import Search from '../../icons/Search';
import { useSearchParams } from '../../utilities/SearchParams';
import './index.scss';
import { Props } from './types';


const baseClass = 'search-filter';

const SearchFilter: React.FC<Props> = (props) => {
  const {
    fieldName = 'id',
    fieldLabel = 'ID',
    modifySearchQuery = true,
    handleChange,
  } = props;

  const params = useSearchParams();
  const navigate = useNavigate();

  const [search, setSearch] = useState(() => params?.where?.[fieldName]?.like || '');

  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    if (debouncedSearch !== params?.where?.[fieldName]?.like) {
      const newWhere = {
        ...(typeof params?.where === 'object' ? params.where : {}),
        [fieldName]: {
          like: debouncedSearch,
        },
      };

      if (!debouncedSearch) {
        delete newWhere[fieldName];
      }

      if (handleChange) handleChange(newWhere as Where);

      if (modifySearchQuery && params?.where?.[fieldName]?.like !== newWhere?.[fieldName]?.like) {
        navigate({
          search: queryString.stringify({
            ...params,
            page: 1,
            where: newWhere,
          }),
        });
      }
    }
  }, [debouncedSearch, history, fieldName, params, handleChange, modifySearchQuery]);

  return (
    <div className={baseClass}>
      <input
        className={`${baseClass}__input`}
        placeholder={`Search by ${fieldLabel}`}
        type="text"
        value={search || ''}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Search />
    </div>
  );
};

export default SearchFilter;
