import { useConfig } from '@payloadcms/config-provider';
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../../forms/Form/context';
import Button from '../Button';
import './index.scss';
import { Props } from './types';


const baseClass = 'duplicate';

const Duplicate: React.FC<Props> = ({ slug }) => {
  const navigate = useNavigate();
  const { getData } = useForm();
  const { routes: { admin } } = useConfig();

  const handleClick = useCallback(() => {
    const data = getData();

    navigate(
      `${admin}/collections/${slug}/create`,
      data);
  }, [navigate, getData, slug, admin]);

  return (
    <Button
      buttonStyle="none"
      className={baseClass}
      onClick={handleClick}
    >
      Duplicate
    </Button>
  );
};

export default Duplicate;
