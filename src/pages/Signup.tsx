import React, {useContext, useState} from 'react';
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

const ORGANIZATIONS = [
  'Well Aware',
  'Other',
];

const COMMUNITIES = [
  'Olpejeta',
  'Kithoka',
  'Sikizana',
  'Olmoran',
  'Meta',
  'Cheptori',
  'Kavuthu',
  'Kaliini',
  'Muruku',
  'Salaita',
  'Sauti Kuu',
  'Mutaki',
  'Other',
];

interface OwnProps extends RouteComponentProps {}

interface StateProps {
  isLoggedIn?: boolean;
}

interface DispatchProps {
  setLoading: typeof setLoading;
  setIsLoggedIn: typeof setIsLoggedIn;
  loadUserData: typeof loadUserData;
}

interface SignupProps extends OwnProps, StateProps, DispatchProps { }

const Signup: React.FC<SignupProps> = ({isLoggedIn,  setLoading, setIsLoggedIn}) => {

  const { t } = useTranslation(['translation'], {i18n} );
  const {navigate} = useContext(NavContext);

  const [formValues, setFormValues] = useState<any>({
    name: '',
    email: '',
    password: '',
    passwordRepeat: '',
    organization: '',
    community: '',
    organizationWritein: '',
    communityWritein: ''
  });
  const [formErrors, setFormErrors] = useState<any>({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showOrganizationTextInput, setShowOrganizationTextInput] = useState(false);
  const [showCommunityTextInput, setShowCommunityTextInput] = useState(false);
  const [serverError, setServerError] = useState<Error>();
  const [organizationList, setOrganizationList] = useState(ORGANIZATIONS);
  const [communityList, setCommunityList] = useState(COMMUNITIES);

  const handleChange = (field:string, value:string) => {
    let errors = {...formErrors};
    let values = {...formValues};
    errors[field] = null;
    values[field] = value;
    if (field === 'organization' && value === 'Other') {
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
      setFormValues({...formValues, organization: detail.data.values.organization});
      let orgs = [...organizationList];
      orgs.push(detail.data.values.organization);
      setOrganizationList(orgs)
    }
    setShowOrganizationTextInput(false);
  }
  const handleCommunityTextChange = (ev:CustomEvent) => {
    const detail = ev.detail;
    if (detail && detail.data && detail.data.values && detail.data.values.community) {
      setFormValues({...formValues, community: detail.data.values.community});
      let comms = [...communityList];
      comms.push(detail.data.values.community);
      setCommunityList(comms)
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
      setLoading(true);
      registerWithEmail(formValues.email, formValues.password)
        .then(() => {
          updateProfile({name: formValues.name, organization: formValues.organization, community: formValues.community})
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
                  <IonInput name="email" type="text" value={formValues.email} spellCheck={false} required={true} autocapitalize="off" autocomplete="on" onIonChange={e => {
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

                <IonItem>
                  <IonLabel position="stacked" color="primary">{t('registration.labels.organization')}</IonLabel>
                  <IonSelect value={formValues.organization}
                             placeholder={t('registration.organizations.selectOne')}
                             cancelText={t('buttons.cancel')}
                             okText={t('buttons.ok')}
                             onIonChange={e => {handleChange('organization', e.detail.value!)}}>
                    {organizationList.map((o, idx) => <IonSelectOption value={o} key={o}>{idx<ORGANIZATIONS.length ? t('registration.organizations.' + o) : o}</IonSelectOption>)}
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
                </IonItem>

                <IonItem>
                  <IonLabel position="stacked" color="primary">{t('registration.labels.community')}</IonLabel>
                  <IonSelect value={formValues.community}
                             placeholder={t('registration.communities.selectOne')}
                             cancelText={t('buttons.cancel')}
                             okText={t('buttons.ok')}
                             onIonChange={e => {handleChange('community', e.detail.value!);}}>
                    {communityList.map((c, idx) => <IonSelectOption value={c} key={c}>{idx<COMMUNITIES.length ? t('registration.communities.' + c) : c}</IonSelectOption>)}
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
                </IonItem>

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
  }),
  component: Signup
})
