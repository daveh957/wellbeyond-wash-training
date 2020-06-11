import React, {useEffect, useState} from 'react';
import {IonAlert, IonItem, IonLabel, IonList, IonSelect, IonSelectOption, IonText} from '@ionic/react';
import {useTranslation} from "react-i18next";
import i18n from '../i18n';
import {Organization, UserProfile} from "../models/User";
import {connect} from "../data/connect";
import * as selectors from "../data/selectors";
import {setDarkMode} from "../data/user/user.actions";
import {withRouter} from "react-router";

interface StateProps {
  organizations?: Organization[];
}

interface MyProps extends StateProps {
  profile: UserProfile,
  setProfile(profile:UserProfile): void;
  error: string;
}

const OrganizationAndCommunity: React.FC<MyProps> = ({organizations, profile, setProfile, error }) => {

  const { t } = useTranslation(['translation'], {i18n} );
  const [showOrganizationTextInput, setShowOrganizationTextInput] = useState(false);
  const [showCommunityTextInput, setShowCommunityTextInput] = useState(false);
  const [organizationList, setOrganizationList] = useState();
  const [communityList, setCommunityList] = useState();
  const [organization, setOrganization] = useState();
  const [community, setCommunity] = useState();

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
  }, [profile]);

  const handleChange = (field:string, value:any) => {
    if (field === 'organization') {
      setOrganization(value);
      if (value && value.id === '_other') {
        setShowOrganizationTextInput(true);
      }
    }
    if (field === 'community') {
      setCommunity(value);
      if (value === 'Other') {
        setShowCommunityTextInput(true);
      }
    }
  }
  const handleOrganizationTextChange = (ev:CustomEvent) => {
    const detail = ev.detail;
    if (detail && detail.data && detail.data.values && detail.data.values.organization) {
      const customOrg = {id: '_custom', name: detail.data.values.organization, communities: []};
      setOrganization(customOrg);
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

  // @ts-ignore
  return (
    <IonList>
      {organizationList && organizationList.length &&
      <IonItem>
        <IonLabel position="stacked" color="primary">{t('registration.labels.organization')}</IonLabel>
        <IonSelect value={organization}
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
        {error && <IonText color="danger">
          <p className="ion-padding-start">
            {t(error)}
          </p>
        </IonText>}
      </IonItem>}

      {communityList && communityList.length &&
      <IonItem>
        <IonLabel position="stacked" color="primary">{t('registration.labels.community')}</IonLabel>
        <IonSelect value={community}
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
  );
};

export default OrganizationAndCommunity;
