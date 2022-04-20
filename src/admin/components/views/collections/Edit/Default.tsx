import { useConfig } from '@payloadcms/config-provider';
import format from 'date-fns/format';
import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Autosave from '../../../elements/Autosave';
import CopyToClipboard from '../../../elements/CopyToClipboard';
import DeleteDocument from '../../../elements/DeleteDocument';
import DuplicateDocument from '../../../elements/DuplicateDocument';
import Eyebrow from '../../../elements/Eyebrow';
import Loading from '../../../elements/Loading';
import PreviewButton from '../../../elements/PreviewButton';
import Publish from '../../../elements/Publish';
import RenderTitle from '../../../elements/RenderTitle';
import SaveDraft from '../../../elements/SaveDraft';
import Status from '../../../elements/Status';
import VersionsCount from '../../../elements/VersionsCount';
import fieldTypes from '../../../forms/field-types';
import Form from '../../../forms/Form';
import RenderFields from '../../../forms/RenderFields';
import FormSubmit from '../../../forms/Submit';
import LeaveWithoutSaving from '../../../modals/LeaveWithoutSaving';
import { useDocumentInfo } from '../../../utilities/DocumentInfo';
import Meta from '../../../utilities/Meta';
import { OperationContext } from '../../../utilities/OperationProvider';
import Auth from './Auth';
import './index.scss';
import { Props } from './types';
import Upload from './Upload';



const baseClass = 'collection-edit';

const DefaultEditView: React.FC<Props> = (props) => {
  const [params, setParams] = useSearchParams()
  const id = params.get('id')
  const { admin: { dateFormat }, routes: { admin } } = useConfig();
  const { publishedDoc } = useDocumentInfo();

  const {
    collection,
    isEditing,
    data,
    onSave,
    permissions,
    isLoading,
    initialState,
    apiURL,
    action,
    hasSavePermission,
  } = props;

  const {
    slug,
    fields,
    admin: {
      useAsTitle,
      disableDuplicate,
      preview,
      hideAPIURL,
    },
    versions,
    timestamps,
    auth,
    upload,
  } = collection;

  const classes = [
    baseClass,
    isEditing && `${baseClass}--is-editing`,
  ].filter(Boolean).join(' ');

  const operation = isEditing ? 'update' : 'create';

  return (
    <div className={classes}>
      {isLoading && (
        <Loading />
      )}
      {!isLoading && (
        <OperationContext.Provider value={operation}>
          <Form
            className={`${baseClass}__form`}
            method={id ? 'put' : 'post'}
            action={action}
            onSuccess={onSave}
            disabled={!hasSavePermission}
            initialState={initialState}
          >
            <div className={`${baseClass}__main`}>
              <Meta
                title={`${isEditing ? 'Editing' : 'Creating'} - ${collection.labels.singular}`}
                description={`${isEditing ? 'Editing' : 'Creating'} - ${collection.labels.singular}`}
                keywords={`${collection.labels.singular}, Payload, CMS`}
              />
              <Eyebrow />
              {!(collection.versions?.drafts && collection.versions?.drafts?.autosave) && (
                <LeaveWithoutSaving />
              )}
              <div className={`${baseClass}__edit`}>
                <header className={`${baseClass}__header`}>
                  <h1>
                    <RenderTitle {...{ data, useAsTitle, fallback: '[Untitled]' }} />
                  </h1>
                </header>
                {auth && (
                  <Auth
                    useAPIKey={auth.useAPIKey}
                    requirePassword={!isEditing}
                    verify={auth.verify}
                    collection={collection}
                    email={data?.email}
                    operation={operation}
                  />
                )}
                {upload && (
                  <Upload
                    data={data}
                    collection={collection}
                  />
                )}
                <RenderFields
                  readOnly={!hasSavePermission}
                  permissions={permissions.fields}
                  filter={(field) => (!field?.admin?.position || (field?.admin?.position !== 'sidebar'))}
                  fieldTypes={fieldTypes}
                  fieldSchema={fields}
                />
              </div>
            </div>
            <div className={`${baseClass}__sidebar-wrap`}>
              <div className={`${baseClass}__sidebar`}>
                <div className={`${baseClass}__sidebar-sticky-wrap`}>
                  <ul className={`${baseClass}__collection-actions`}>
                    {(permissions?.create?.permission) && (
                      <React.Fragment>
                        <li><Link to={`${admin}/collections/${slug}/create`}>Create New</Link></li>
                        {!disableDuplicate && (
                          <li><DuplicateDocument slug={slug} /></li>
                        )}
                      </React.Fragment>
                    )}
                    {permissions?.delete?.permission && (
                      <li>
                        <DeleteDocument
                          collection={collection}
                          id={id}
                        />
                      </li>
                    )}
                  </ul>
                  <div className={`${baseClass}__document-actions${((collection.versions?.drafts && !collection.versions?.drafts?.autosave) || (isEditing && preview)) ? ` ${baseClass}__document-actions--has-2` : ''}`}>
                    {(preview && (!collection.versions?.drafts || collection.versions?.drafts?.autosave)) && (
                      <PreviewButton
                        generatePreviewURL={preview}
                        data={data}
                      />
                    )}
                    {hasSavePermission && (
                      <React.Fragment>
                        {collection.versions?.drafts && (
                          <React.Fragment>
                            {!collection.versions.drafts.autosave && (
                              <SaveDraft />
                            )}
                            <Publish />
                          </React.Fragment>
                        )}
                        {!collection.versions?.drafts && (
                          <FormSubmit>Save</FormSubmit>
                        )}
                      </React.Fragment>
                    )}
                  </div>
                  <div className={`${baseClass}__sidebar-fields`}>
                    {(isEditing && preview && (collection.versions?.drafts && !collection.versions?.drafts?.autosave)) && (
                      <PreviewButton
                        generatePreviewURL={preview}
                        data={data}
                      />
                    )}
                    {collection.versions?.drafts && (
                      <React.Fragment>
                        <Status />
                        {(collection.versions?.drafts.autosave && hasSavePermission) && (
                          <Autosave
                            publishedDocUpdatedAt={publishedDoc?.updatedAt || data?.createdAt}
                            collection={collection}
                            id={id}
                          />
                        )}
                      </React.Fragment>
                    )}
                    <RenderFields
                      readOnly={!hasSavePermission}
                      permissions={permissions.fields}
                      filter={(field) => field?.admin?.position === 'sidebar'}
                      fieldTypes={fieldTypes}
                      fieldSchema={fields}
                    />
                  </div>
                  {isEditing && (
                    <ul className={`${baseClass}__meta`}>
                      {!hideAPIURL && (
                        <li className={`${baseClass}__api-url`}>
                          <span className={`${baseClass}__label`}>
                            API URL
                            {' '}
                            <CopyToClipboard value={apiURL} />
                          </span>
                          <a
                            href={apiURL}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {apiURL}
                          </a>
                        </li>
                      )}
                      {versions && (
                        <li>
                          <div className={`${baseClass}__label`}>Versions</div>
                          <VersionsCount
                            collection={collection}
                            id={id}
                          />
                        </li>
                      )}
                      {timestamps && (
                        <React.Fragment>
                          {data.updatedAt && (
                            <li>
                              <div className={`${baseClass}__label`}>Last Modified</div>
                              <div>{format(new Date(data.updatedAt), dateFormat)}</div>
                            </li>
                          )}
                          {(publishedDoc?.createdAt || data?.createdAt) && (
                            <li>
                              <div className={`${baseClass}__label`}>Created</div>
                              <div>{format(new Date(publishedDoc?.createdAt || data?.createdAt), dateFormat)}</div>
                            </li>
                          )}
                        </React.Fragment>
                      )}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </Form>
        </OperationContext.Provider>
      )}
    </div>
  );
};

export default DefaultEditView;
