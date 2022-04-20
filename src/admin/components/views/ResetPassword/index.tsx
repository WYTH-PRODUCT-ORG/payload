import { useAuth, useConfig } from '@payloadcms/config-provider';
import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Button from '../../elements/Button';
import ConfirmPassword from '../../forms/field-types/ConfirmPassword';
import HiddenInput from '../../forms/field-types/HiddenInput';
import Password from '../../forms/field-types/Password';
import Form from '../../forms/Form';
import FormSubmit from '../../forms/Submit';
import MinimalTemplate from '../../templates/Minimal';
import Meta from '../../utilities/Meta';
import './index.scss';



const baseClass = 'reset-password';

const ResetPassword: React.FC = () => {
  const { admin: { user: userSlug }, serverURL, routes: { admin, api } } = useConfig();
  const { token } = useParams<{ token?: string }>();
  const navigate = useNavigate();
  const { user, setToken } = useAuth();

  const onSuccess = (data) => {
    if (data.token) {
      setToken(data.token);
      navigate(`${admin}`);
    }
  };

  if (user) {
    return (
      <MinimalTemplate className={baseClass}>
        <Meta
          title="Reset Password"
          description="Reset password"
          keywords="Reset Password, Payload, CMS"
        />

        <div className={`${baseClass}__wrap`}>
          <h1>Already logged in</h1>
          <p>
            To log in with another user, you should
            {' '}
            <Link to={`${admin}/logout`}>log out</Link>
            {' '}
            first.
          </p>
          <br />
          <Button
            el="link"
            buttonStyle="secondary"
            to={admin}
          >
            Back to Dashboard
          </Button>
        </div>
      </MinimalTemplate>
    );
  }

  return (
    <MinimalTemplate className={baseClass}>
      <div className={`${baseClass}__wrap`}>
        <h1>Reset Password</h1>
        <Form
          onSuccess={onSuccess}
          method="post"
          action={`${serverURL}${api}/${userSlug}/reset-password`}
          redirect={admin}
        >
          <Password
            label="New Password"
            name="password"
            autoComplete="off"
            required
          />
          <ConfirmPassword />
          <HiddenInput
            name="token"
            value={token}
          />
          <FormSubmit>Reset Password</FormSubmit>
        </Form>
      </div>
    </MinimalTemplate>
  );
};

export default ResetPassword;
