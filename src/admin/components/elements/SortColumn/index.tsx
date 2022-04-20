import queryString from 'qs';
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Chevron from '../../icons/Chevron';
import { useSearchParams } from '../../utilities/SearchParams';
import Button from '../Button';
import './index.scss';
import { Props } from './types';


const baseClass = 'sort-column';

const SortColumn: React.FC<Props> = (props) => {
  const {
    label, name, disable = false,
  } = props;
  const params = useSearchParams();
  const navigate = useNavigate();

  const { sort } = params;

  const desc = `-${name}`;
  const asc = name;

  const ascClasses = [`${baseClass}__asc`];
  if (sort === asc) ascClasses.push(`${baseClass}--active`);

  const descClasses = [`${baseClass}__desc`];
  if (sort === desc) descClasses.push(`${baseClass}--active`);

  const setSort = useCallback((newSort) => {
    navigate({
      search: queryString.stringify({
        ...params,
        sort: newSort,
      }, { addQueryPrefix: true }),
    });
  }, [params, history]);

  return (
    <div className={baseClass}>
      <span className={`${baseClass}__label`}>{label}</span>
      {!disable && (
        <span className={`${baseClass}__buttons`}>
          <Button
            round
            buttonStyle="none"
            className={ascClasses.join(' ')}
            onClick={() => setSort(asc)}
          >
            <Chevron />
          </Button>
          <Button
            round
            buttonStyle="none"
            className={descClasses.join(' ')}
            onClick={() => setSort(desc)}
          >
            <Chevron />
          </Button>
        </span>
      )}
    </div>
  );
};

export default SortColumn;
