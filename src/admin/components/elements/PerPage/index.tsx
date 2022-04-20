import qs from 'qs';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { defaults } from '../../../../collections/config/defaults';
import Chevron from '../../icons/Chevron';
import { useSearchParams } from '../../utilities/SearchParams';
import Popup from '../Popup';
import './index.scss';


const baseClass = 'per-page';

const defaultLimits = defaults.admin.pagination.limits;

type Props = {
  limits: number[]
  limit: number
  handleChange?: (limit: number) => void
  modifySearchParams?: boolean
}

const PerPage: React.FC<Props> = ({ limits = defaultLimits, limit, handleChange, modifySearchParams = true }) => {
  const params = useSearchParams();
  const navigate = useNavigate();

  return (
    <div className={baseClass}>
      <Popup
        color="dark"
        horizontalAlign="right"
        button={(
          <strong>
            Per Page:
            {' '}
            {limit}
            <Chevron />
          </strong>
        )}
        render={({ close }) => (
          <div>
            <ul>
              {limits.map((limitNumber, i) => (
                <li
                  className={`${baseClass}-item`}
                  key={i}
                >
                  <button
                    type="button"
                    className={[
                      `${baseClass}__button`,
                      limitNumber === Number(limit) && `${baseClass}__button-active`,
                    ].filter(Boolean).join(' ')}
                    onClick={() => {
                      close();
                      if (handleChange) handleChange(limitNumber);
                      if (modifySearchParams) {
                        navigate({
                          search: qs.stringify({
                            ...params,
                            limit: limitNumber,
                          }, { addQueryPrefix: true }),
                        });
                      }
                    }}
                  >
                    {limitNumber === Number(limit) && (
                      <Chevron />
                    )}
                    {limitNumber}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      />
    </div>
  );
};

export default PerPage;
