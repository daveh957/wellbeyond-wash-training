import React, {useContext, useEffect, useState} from 'react';
import {
  IonAlert,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCol,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonMenuButton,
  IonPage,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonText,
  IonTitle,
  IonToolbar,
  NavContext
} from '@ionic/react';
import './Login.scss';
import {useTranslation} from "react-i18next";
import i18n from '../i18n';
import {connect} from '../data/connect';
import {RouteComponentProps} from 'react-router';
import {Redirect} from "react-router-dom";
import {registerWithEmail, updateProfile} from "../data/user/userApi";
import {loadUserData, setIsLoggedIn, setLoading} from "../data/user/user.actions";
import {Organization} from "../models/User";

interface OwnProps extends RouteComponentProps {}

interface StateProps {
  isLoggedIn?: boolean;
  organizations?: Organization[];
}

interface DispatchProps {
  setLoading: typeof setLoading;
  setIsLoggedIn: typeof setIsLoggedIn;
  loadUserData: typeof loadUserData;
}

interface SignupProps extends OwnProps, StateProps, DispatchProps { }

const Signup: React.FC<SignupProps> = ({isLoggedIn,organizations,  setLoading, setIsLoggedIn}) => {

  const { t } = useTranslation(['translation'], {i18n} );
  const {navigate} = useContext(NavContext);

  const [formValues, setFormValues] = useState<any>({
    name: '',
    email: '',
    password: '',
    passwordRepeat: '',
    organization: undefined,
    community: '',
  });
  const [formErrors, setFormErrors] = useState<any>({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showOrganizationTextInput, setShowOrganizationTextInput] = useState(false);
  const [showCommunityTextInput, setShowCommunityTextInput] = useState(false);
  const [serverError, setServerError] = useState<Error>();
  const [organizationList, setOrganizationList] = useState();
  const [communityList, setCommunityList] = useState();

  useEffect(() => {
    if (organizations) {
      let list = organizations.sort((a: Organization, b: Organization) => {
          return a.name < b.name ? -1 : +1;
      });
      list.push({id: '_other', name: 'Other', communities: []});
      setOrganizationList(list);
    }
  }, [organizations]);

  useEffect(() => {
    if (formValues.organization && formValues.organization.communities && formValues.organization.communities.length) {
      let list = formValues.organization.communities.map((c:any) => c.name).sort((a: string, b: string) => {
        return a < b ? -1 : +1;
      });
      list.push('Other');
      setCommunityList(list);
    }
    else {
      setCommunityList(undefined);
    }
  }, [formValues.organization]);

  const handleChange = (field:string, value:any) => {
    let errors = {...formErrors};
    let values = {...formValues};
    errors[field] = null;
    values[field] = value;
    if (field === 'organization') {
      if (value && value.id === '_other')
        setShowOrganizationTextInput(true);
    }
    if (field === 'community' && value === 'Other') {
        setShowCommunityTextInput(true);
    }
    setFormErrors(errors);
    setFormValues(values);
  }
  const handleOrganizationTextChange = (ev:CustomEvent) => {
    const detail = ev.detail;
    if (detail && detail.data && detail.data.values && detail.data.values.organization) {
      const customOrg = {id: '_custom', name: detail.data.values.organization, communities: []};
      setFormValues({...formValues, organization: customOrg});
      let list = organizationList.filter((o:Organization) => o.id !== '_custom' && o.id !== '_other');
      list.push(customOrg);
      list.push({id: '_other', name: 'Other', communities: []});
      setOrganizationList(list);
    }
    setShowOrganizationTextInput(false);
  }
  const handleCommunityTextChange = (ev:CustomEvent) => {
    const detail = ev.detail;
    if (detail && detail.data && detail.data.values && detail.data.values.community) {
      setFormValues({...formValues, community: detail.data.values.community});
      let list = formValues.organization.communities.map((c:any) => c.name).sort((a: string, b: string) => {
        return a < b ? -1 : +1;
      });
      list.push(detail.data.values.community);
      list.push('Other');
      setCommunityList(list);
    }
    setShowCommunityTextInput(false);
  }

  const validate = ():boolean => {
    let errors = {...formErrors};
    errors.name = formValues.name ? null : 'registration.errors.nameRequired';
    errors.email = formValues.email ? null : 'registration.errors.emailRequired';
    errors.password = formValues.password ? (formValues.password.length >= 8 ? null :  'registration.errors.passwordLength') : 'registration.errors.passwordRequired';
    errors.passwordRepeat = (formValues.password === formValues.passwordRepeat ? null :  'registration.errors.passwordMismatch');
    setFormErrors(errors);
    return !Object.values(errors).some(x => (x !== null && x !== ''));
  }

  const signup = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    if(validate()) {
      let profile:any = {
        name: formValues.name
      }
      if (formValues.organization) {
        if (formValues.organization.id && formValues.organization.id !== '_other' && formValues.organization.id !== '_custom') {
          profile.organizationId = formValues.organization.id;
        }
        else {
          profile.organization = formValues.organization.name;
        }
        if (formValues.community) {
          profile.community = formValues.community;
        }
      }
      setLoading(true);
      registerWithEmail(formValues.email.trim().toLowerCase(), formValues.password)
        .then(() => {
          updateProfile(profile)
            .then(() => {
              setLoading(false);
              setIsLoggedIn(true);
              navigate('/terms', 'forward');
              loadUserData();
            })
            .catch(error => {
              setLoading(false);
              setServerError(error);
            });
        })
        .catch(error => {
          setLoading(false);
          setServerError(error);
        });
    }
  };

  if (isLoggedIn) {
    return <Redirect to={'/terms'} />
  }

  // @ts-ignore
  return (
    <IonPage id="signup-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton></IonMenuButton>
          </IonButtons>
          <IonTitle>{t('registration.pages.signup')}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <form noValidate onSubmit={signup}>
          <IonCard>
            <IonCardContent>
              <div className="login-logo">
                <img src="assets/img/appicon.png" alt="WellBeyond logo" />
              </div>
              <p>{t('registration.messages.signupInfo')}</p>

              <IonList>
                <IonItem>
                  <IonLabel position="stacked" color="primary">{t('registration.labels.name')}</IonLabel>
                  <IonInput name="name" type="text" value={formValues.name} spellCheck={false} autocapitalize="on" autocomplete="on" required={true} onIonChange={e => {
                    handleChange('name', e.detail.value!);
                  }}>
                  </IonInput>
                </IonItem>

                {formSubmitted && formErrors.name && <IonText color="danger">
                  <p className="ion-padding-start">
                    {t(formErrors.name)}
                  </p>
                </IonText>}

                <IonItem>
                  <IonLabel position="stacked" color="primary">{t('registration.labels.email')}</IonLabel>
                  <IonInput name="email" type="email" value={formValues.email} spellCheck={false} required={true} autocapitalize="off" autocomplete="on" inputmode="email" onIonChange={e => {
                    handleChange('email', e.detail.value!);
                  }}>
                  </IonInput>
                </IonItem>

                {formSubmitted && formErrors.email && <IonText color="danger">
                  <p className="ion-padding-start">
                    {t(formErrors.email)}
                  </p>
                </IonText>}

                <IonItem>
                  <IonLabel position="stacked" color="primary">{t('registration.labels.password')}</IonLabel>
                  <IonInput name="password" type="password" value={formValues.password} minlength={8} required={true} onIonChange={e => {
                    handleChange('password', e.detail.value!);
                  }}>
                  </IonInput>
                </IonItem>

                {formSubmitted && formErrors.password && <IonText color="danger">
                  <p className="ion-padding-start">
                    {t(formErrors.password)}
                  </p>
                </IonText>}

                <IonItem>
                  <IonLabel position="stacked" color="primary">{t('registration.labels.passwordRepeat')}</IonLabel>
                  <IonInput name="passwordRepeat" type="password" value={formValues.passwordRepeat} minlength={8} required={true} onIonChange={e => {
                    handleChange('passwordRepeat', e.detail.value!);
                  }}>
                  </IonInput>
                </IonItem>

                {formSubmitted && formErrors.passwordRepeat && <IonText color="danger">
                  <p className="ion-padding-start">
                    {t(formErrors.passwordRepeat)}
                  </p>
                </IonText>}

                {organizationList && organizationList.length &&
                <IonItem>
                  <IonLabel position="stacked" color="primary">{t('registration.labels.organization')}</IonLabel>
                  <IonSelect value={formValues.organization}
                             placeholder={t('registration.organizations.selectOne')}
                             cancelText={t('buttons.cancel')}
                             okText={t('buttons.ok')}
                             onIonChange={e => {handleChange('organization', e.detail.value!)}}>
                    {organizationList.map((o:Organization) => <IonSelectOption value={o} key={o.id}>{o.name}</IonSelectOption>)}
                  </IonSelect>
                  <IonAlert
                    isOpen={showOrganizationTextInput}
                    //ts-ignore
                    onDidDismiss={handleOrganizationTextChange}
                    header={t('registration.labels.organizationWritein')}
                    inputs={[
                      {
                        name: 'organization',
                        type: 'text',
                        placeholder: ''
                      }]
                    }
                    buttons={ [{ text: t('buttons.cancel'), role: 'cancel'}, { text: t('buttons.ok') }] }
                  />
                </IonItem>}

                {communityList && communityList.length &&
                <IonItem>
                  <IonLabel position="stacked" color="primary">{t('registration.labels.community')}</IonLabel>
                  <IonSelect value={formValues.community}
                             placeholder={t('registration.communities.selectOne')}
                             cancelText={t('buttons.cancel')}
                             okText={t('buttons.ok')}
                             onIonChange={e => {handleChange('community', e.detail.value!);}}>
                    {communityList.map((c:string) => <IonSelectOption value={c} key={c}>{c}</IonSelectOption>)}
                  </IonSelect>
                  <IonAlert
                    isOpen={showCommunityTextInput}
                    //ts-ignore
                    onDidDismiss={handleCommunityTextChange}
                    header={t('registration.labels.communityWritein')}
                    inputs={[
                      {
                        name: 'community',
                        type: 'text',
                        placeholder: ''
                      }]
                    }
                    buttons={ [{ text: t('buttons.cancel'), role: 'cancel'}, { text: t('buttons.ok') }] }
                  />
                </IonItem>}

              </IonList>

              {formSubmitted && serverError && <IonText color="danger">
                <p className="ion-padding-start">
                  {serverError.message}
                </p>
              </IonText>}
            </IonCardContent>
          </IonCard>

          <IonRow>
            <IonCol>
              <IonButton type="submit" expand="block">{t('registration.buttons.createAccount')}</IonButton>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonButton routerLink="/login" color="light" expand="block">{t('registration.buttons.existinguser')}</IonButton>
            </IonCol>
          </IonRow>
        </form>

      </IonContent>

    </IonPage>
  );
};

export default connect<OwnProps, StateProps, DispatchProps>({
  mapDispatchToProps: {
    setLoading,
    setIsLoggedIn,
    loadUserData
  },
  mapStateToProps: (state) => ({
    isLoggedIn: state.user.isLoggedIn,
    organizations: state.user.organizations
  }),
  component: Signup
})
