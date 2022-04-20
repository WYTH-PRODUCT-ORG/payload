import { Modal, useModal } from '@faceless-ui/modal';
import { useConfig } from '@payloadcms/config-provider';
import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { requests } from '../../../api';
import useTitle from '../../../hooks/useTitle';
import { useForm } from '../../forms/Form/context';
import MinimalTemplate from '../../templates/Minimal';
import Button from '../Button';
import './index.scss';
import { Props } from './types';


const baseClass = 'delete-document';

const DeleteDocument: React.FC<Props> = (props) => {
  const {
    title: titleFromProps,
    id,
    collection: {
      admin: {
        useAsTitle,
      },
      slug,
      labels: {
        singular,
      } = {},
    } = {},
  } = props;

  const { serverURL, routes: { api, admin } } = useConfig();
  const { setModified } = useForm();
  const [deleting, setDeleting] = useState(false);
  const { closeAll, toggle } = useModal();
  const navigate = useNavigate();
  const title = useTitle(useAsTitle) || id;
  const titleToRender = titleFromProps || title;

  const modalSlug = `delete-${id}`;

  const addDefaultError = useCallback(() => {
    toast.error(`There was an error while deleting ${title}. Please check your connection and try again.`);
  }, [title]);

  const handleDelete = useCallback(() => {
    setDeleting(true);
    setModified(false);
    requests.delete(`${serverURL}${api}/${slug}/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(async (res) => {
      try {
        const json = await res.json();
        if (res.status < 400) {
          closeAll();
          toast.success(`${singular} "${title}" successfully deleted.`);
          return navigate(`${admin}/collections/${slug}`);
        }

        closeAll();

        if (json.errors) {
          toast.error(json.errors);
        }
        addDefaultError();
        return false;
      } catch (e) {
        return addDefaultError();
      }
    });
  }, [addDefaultError, closeAll, navigate, id, singular, slug, title, admin, api, serverURL, setModified]);

  if (id) {
    return (
      <React.Fragment>
        <button
          type="button"
          className={`${baseClass}__toggle`}
          onClick={(e) => {
            e.preventDefault();
            toggle(modalSlug);
          }}
        >
          Delete
        </button>
        <Modal
          slug={modalSlug}
          className={baseClass}
        >
          <MinimalTemplate>
            <h1>Confirm deletion</h1>
            <p>
              You are about to delete the
              {' '}
              {singular}
              {' '}
              &quot;
              <strong>
                {titleToRender}
              </strong>
              &quot;. Are you sure?
            </p>
            <Button
              buttonStyle="secondary"
              type="button"
              onClick={deleting ? undefined : () => toggle(modalSlug)}
            >
              Cancel
            </Button>
            <Button
              onClick={deleting ? undefined : handleDelete}
            >
              {deleting ? 'Deleting...' : 'Confirm'}
            </Button>
          </MinimalTemplate>
        </Modal>
      </React.Fragment>
    );
  }

  return null;
};

export default DeleteDocument;
