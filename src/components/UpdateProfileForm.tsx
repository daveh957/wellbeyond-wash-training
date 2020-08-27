import React, {useEffect, useState} from 'react';
import {
  IonAlert,
  IonButton,
  IonCol,
  IonInput,
  IonItem,
  IonLabel,
  IonList, IonNote,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonText
} from '@ionic/react';
import {Trans, useTranslation} from "react-i18next";
import i18n from '../i18n';
import {Organization, UserProfile} from "../models/User";
import {setLoading} from "../data/user/user.actions";
import {updateProfile} from "../data/user/userApi";

interface MyProps {
  profile?: UserProfile;
  organizations?: Organization[];
  onSave(): void;
  saveButtonLabel: string;
  setLoading: typeof setLoading;
}

const UpdateProfileForm: React.FC<MyProps> = ({profile, organizations, onSave, saveButtonLabel, setLoading }) => {

  const { t } = useTranslation(['translation'], {i18n} );

  const [showOrganizationTextInput, setShowOrganizationTextInput] = useState<boolean>(false);
  const [showCommunityTextInput, setShowCommunityTextInput] = useState<boolean>(false);
  const [organizationList, setOrganizationList] = useState<Organization[]>([]);
  const [communityList, setCommunityList] = useState<string[]>();

  const [name, setName] = useState<string>();
  const [organization, setOrganization] = useState<Organization>();
  const [community, setCommunity] = useState<string>();
  const [orgPassword, setOrgPassword] = useState<string>();

  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [serverError, setServerError] = useState<Error>();
  const [nameError, setNameError] = useState<string>();
  const [organizationError, setOrganizationError] = useState<string>();
  const [orgPasswordError, setOrgPasswordError] = useState<string>();

  useEffect(() => {
    if (organizations) {
      let list = organizations.sort((a: Organization, b: Organization) => {
        return a.name < b.name ? -1 : +1;
      });
      // Don't show Other as a choice for Organization
      // list.push({id: '_other', name: 'Other', communities: []});
      setOrganizationList(list);
    }
  }, [organizations]);

  useEffect(() => {
    if (!profile || !organizations) {
      return;
    }
    let organization;
    if (profile.organizationId) {
      organization = organizations.find((o) => o.id === profile.organizationId);
    }
    else if (profile.organization === 'Other') {
      organization = {id: '_other', name: 'Other', communities: []};
    }
    else if (profile.organization) {
      organization = {id: '_custom', name: profile.organization, communities: []};
    }
    setName(profile.name);
    setOrganization(organization);
    setCommunity(profile.community);
    updateCommunityList(organization);
  }, [profile, organizations]);

  const updateCommunityList = (organization:Organization|undefined) => {
    if (organization && organization.communities && organization.communities.length) {
      let list = organization.communities.map((c:any) => c.name).sort((a: string, b: string) => {
        return a < b ? -1 : +1;
      });
      list.push('Other');
      setCommunityList(list);
    }
    else {
      setCommunityList(undefined);
    }
  }

  const handleOrganizationSelected = (organization:Organization) => {
    setOrganization(organization);
    updateCommunityList(organization);
    if (organization.id === '_other') {
      setShowOrganizationTextInput(true);
    }
  }

  const handleOrganizationTextChange = (ev:CustomEvent) => {
    const detail = ev.detail;
    if (detail && detail.data && detail.data.values && detail.data.values.organization) {
      const customOrg = {id: '_custom', name: detail.data.values.organization, communities: []};
      handleOrganizationSelected(customOrg);
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
      setCommunity(detail.data.values.community);
      let list = organization ? organization.communities.map((c:any) => c.name).sort((a: string, b: string) => {
        return a < b ? -1 : +1;
      }) : [];
      list.push(detail.data.values.community);
      list.push('Other');
      setCommunityList(list);
    }
    setShowCommunityTextInput(false);
  }

  const validate = ():boolean => {
    const nameError = name ? undefined :'registration.errors.nameRequired';
    const organizationError = organization ? undefined : 'registration.errors.organizationRequired';
    const orgPasswordError  = (organization && organization.password && orgPassword !== organization.password) ?
      (orgPassword ? 'registration.errors.organizationPasswordIncorrect' : 'registration.errors.organizationPasswordRequired') : undefined;
    setNameError(nameError);
    setOrganizationError(organizationError);
    setOrgPasswordError(orgPasswordError);
    return !(nameError || organizationError || orgPasswordError);
  }

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setServerError(undefined);
    if(validate()) {
      setLoading(true);
      const profile = {
        name: name
      } as Partial<UserProfile>;
      if (organization) {
        if (organization.id === '_other' || organization.id === '_custom') {
          profile.organization = organization.name;
        }
        else {
          profile.organizationId = organization.id;
          profile.community = community || '';
        }
      }
      updateProfile(profile)
        .then((result) => {
          setLoading(false);
          if (onSave) {
            onSave();
          }
        })
        .catch(error => {
          setLoading(false);
          setServerError(error);
        });
    }
  };


  // @ts-ignore
  return (
    <form noValidate onSubmit={save}>
      <IonList>
        <IonItem>
          <IonLabel position="stacked" color="primary">{t('registration.labels.name')}</IonLabel>
          <IonInput name="name" type="text" value={name} spellCheck={false} autocapitalize="on" autocomplete="on" required={true} onIonChange={e => {
            setName(e.detail.value!);
          }}>
          </IonInput>
        </IonItem>

        {formSubmitted && nameError && <IonText color="danger">
          <p className="ion-padding-start">
            {t(nameError)}
          </p>
        </IonText>}

        {organizationList && organizationList.length &&
        <IonItem>
          <IonLabel position="stacked" color="primary">{t('registration.labels.organization')}</IonLabel>
          <IonSelect value={organization}
                     placeholder={t('registration.organizations.selectOne')}
                     cancelText={t('buttons.cancel')}
                     okText={t('buttons.ok')}
                     onIonChange={e => {handleOrganizationSelected(e.detail.value!)}}>
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
          {organizationError && <IonText color="danger">
            <p className="ion-padding-start">
              {t(organizationError)}
            </p>
          </IonText>}
        </IonItem>
        }

        {organization && organization.password &&
        <IonItem>
          <IonLabel position="stacked" color="primary">{t('registration.labels.organizationPassword')}</IonLabel>
          <IonInput name="password" type="password" value={orgPassword} required={true} onIonChange={e => {
            setOrgPassword(e.detail.value!);
          }}>
          </IonInput>
          <IonNote>{t('registration.labels.organizationPasswordHint', {organization: organization.name})}</IonNote>
          {organization.contactName && organization.contactEmail &&
            <IonNote>
              <Trans
                i18nKey="registration.errors.organizationPasswordContact"
                values={{contactName: organization.contactName, contactEmail: organization.contactEmail}}/>
            </IonNote>
          }
          {orgPasswordError && <IonText color="danger">
            <p className="ion-padding-start">
              {t(orgPasswordError, {organization: organization.name})}
            </p>
          </IonText>}
        </IonItem>
        }

        {communityList && communityList.length &&
        <IonItem>
          <IonLabel position="stacked" color="primary">{t('registration.labels.community')}</IonLabel>
          <IonSelect value={community}
                     placeholder={t('registration.communities.selectOne')}
                     cancelText={t('buttons.cancel')}
                     okText={t('buttons.ok')}
                     onIonChange={e => {setCommunity(e.detail.value!);}}>
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

      {formSubmitted && serverError &&
        <IonText color="danger">
          <p className="ion-padding-start">
            {serverError.message}
          </p>
        </IonText>
      }

      <IonRow>
        <IonCol>
          <IonButton type="submit" expand="block">{saveButtonLabel}</IonButton>
        </IonCol>
      </IonRow>
    </form>
  );
};

export default UpdateProfileForm;
