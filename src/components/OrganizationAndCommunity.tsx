import React, {useEffect, useState} from 'react';
import {IonAlert, IonItem, IonLabel, IonList, IonSelect, IonSelectOption} from '@ionic/react';
import {useTranslation} from "react-i18next";
import i18n from '../i18n';
import {Organization} from "../models/User";

interface MyProps {
  organizations?: Organization[];
  organization?: Organization;
  community?: string;
  setOrganization(organization:Organization): void;
  setCommunity(community:string): void;
}

const OrganizationAndCommunity: React.FC<MyProps> = ({organizations, organization, community, setOrganization, setCommunity }) => {

  const { t } = useTranslation(['translation'], {i18n} );
  const [showOrganizationTextInput, setShowOrganizationTextInput] = useState(false);
  const [showCommunityTextInput, setShowCommunityTextInput] = useState(false);
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
  }, [organization]);

  const handleChange = (field:string, value:any) => {
    if (field === 'organization') {
      setOrganization(value);
      if (value && value.id === '_other')
        setShowOrganizationTextInput(true);
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
