import { Modal, useModal } from '@faceless-ui/modal';
import { useConfig } from '@payloadcms/config-provider';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../elements/Button';
import MinimalTemplate from '../../templates/Minimal';
import './index.scss';
import { Props } from './types';


const baseClass = 'stay-logged-in';

const StayLoggedInModal: React.FC<Props> = (props) => {
  const { refreshCookie } = props;
  const navigate = useNavigate();
  const { routes: { admin } } = useConfig();
  const { closeAll: closeAllModals } = useModal();

  return (
    <Modal
      className={baseClass}
      slug="stay-logged-in"
    >
      <MinimalTemplate>
        <h1>Stay logged in</h1>
        <p>You haven&apos;t been active in a little while and will shortly be automatically logged out for your own security. Would you like to stay logged in?</p>
        <div className={`${baseClass}__actions`}>
          <Button
            buttonStyle="secondary"
            onClick={() => {
              closeAllModals();
              navigate(`${admin}/logout`);
            }}
          >
            Log out
          </Button>
          <Button onClick={() => {
            refreshCookie();
            closeAllModals();
          }}
          >
            Stay logged in
          </Button>
        </div>
      </MinimalTemplate>
    </Modal>
  );
};

export default StayLoggedInModal;
