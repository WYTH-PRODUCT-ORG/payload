import queryString from 'qs';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fieldAffectsData } from '../../../../fields/config/types';
import sortableFieldTypes from '../../../../fields/sortableFieldTypes';
import { useSearchParams } from '../../utilities/SearchParams';
import ReactSelect from '../ReactSelect';
import './index.scss';
import { Props } from './types';


const baseClass = 'sort-complex';

const sortOptions = [{ label: 'Ascending', value: '' }, { label: 'Descending', value: '-' }];

const SortComplex: React.FC<Props> = (props) => {
  const {
    collection,
    modifySearchQuery = true,
    handleChange,
  } = props;

  const navigate = useNavigate();
  const params = useSearchParams();

  const [sortFields] = useState(() => collection.fields.reduce((fields, field) => {
    if (fieldAffectsData(field) && sortableFieldTypes.indexOf(field.type) > -1) {
      return [
        ...fields,
        { label: field.label, value: field.name },
      ];
    }
    return fields;
  }, []));

  const [sortField, setSortField] = useState(sortFields[0]);
  const [sortOrder, setSortOrder] = useState({ label: 'Descending', value: '-' });

  useEffect(() => {
    if (sortField?.value) {
      const newSortValue = `${sortOrder.value}${sortField.value}`;

      if (handleChange) handleChange(newSortValue);

      if (params.sort !== newSortValue && modifySearchQuery) {
        navigate({
          search: queryString.stringify({
            ...params,
            sort: newSortValue,
          }, { addQueryPrefix: true }),
        });
      }
    }
  }, [history, params, sortField, sortOrder, modifySearchQuery, handleChange]);

  return (
    <div className={baseClass}>
      <React.Fragment>
        <div className={`${baseClass}__wrap`}>
          <div className={`${baseClass}__select`}>
            <div className={`${baseClass}__label`}>
              Column to Sort
            </div>
            <ReactSelect
              value={sortField}
              options={sortFields}
              onChange={setSortField}
            />
          </div>
          <div className={`${baseClass}__select`}>
            <div className={`${baseClass}__label`}>
              Order
            </div>
            <ReactSelect
              value={sortOrder}
              options={sortOptions}
              onChange={setSortOrder}
            />
          </div>
        </div>
      </React.Fragment>
    </div>
  );
};

export default SortComplex;
