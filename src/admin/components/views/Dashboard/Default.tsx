import { useConfig } from '@payloadcms/config-provider';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../elements/Button';
import Card from '../../elements/Card';
import Eyebrow from '../../elements/Eyebrow';
import './index.scss';
import { Props } from './types';


const baseClass = 'dashboard';

const Dashboard: React.FC<Props> = (props) => {
  const {
    collections,
    globals,
    permissions,
  } = props;

  const navigate = useNavigate();

  const {
    routes: {
      admin,
    },
    admin: {
      components: {
        afterDashboard,
        beforeDashboard,
      },
    },
  } = useConfig();

  return (
    <div className={baseClass}>
      <Eyebrow />
      <div className={`${baseClass}__wrap`}>
        {Array.isArray(beforeDashboard) && beforeDashboard.map((Component, i) => <Component key={i} />)}
        <h3 className={`${baseClass}__label`}>Collections</h3>
        <ul className={`${baseClass}__card-list`}>
          {collections.map((collection) => {
            const hasCreatePermission = permissions?.collections?.[collection.slug]?.create?.permission;

            return (
              <li key={collection.slug}>
                <Card
                  title={collection.labels.plural}
                  onClick={() => navigate({ pathname: `${admin}/collections/${collection.slug}` })}
                  actions={hasCreatePermission ? (
                    <Button
                      el="link"
                      to={`${admin}/collections/${collection.slug}/create`}
                      icon="plus"
                      round
                      buttonStyle="icon-label"
                      iconStyle="with-border"
                    />
                  ) : undefined}
                />
              </li>
            );
          })}
        </ul>
        {(globals.length > 0) && (
          <React.Fragment>
            <h3 className={`${baseClass}__label`}>Globals</h3>
            <ul className={`${baseClass}__card-list`}>
              {globals.map((global) => (
                <li key={global.slug}>
                  <Card
                    title={global.label}
                    onClick={() => navigate({ pathname: `${admin}/globals/${global.slug}` })}
                  />
                </li>
              ))}
            </ul>
          </React.Fragment>
        )}
        {Array.isArray(afterDashboard) && afterDashboard.map((Component, i) => <Component key={i} />)}
      </div>
    </div>
  );
};

export default Dashboard;
