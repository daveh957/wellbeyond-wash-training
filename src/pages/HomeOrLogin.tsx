import React from 'react';
import {connect} from '../data/connect';
import {Redirect} from 'react-router';
import {IonContent, IonLoading} from '@ionic/react';

interface StateProps {
  isLoggedIn?: boolean;
  acceptedTerms?: boolean;
  loading: boolean;
}

const HomeOrLogin: React.FC<StateProps> = ({ isLoggedIn , acceptedTerms, loading}) => {
  if (typeof isLoggedIn === 'undefined' || loading) {
    return (
      <IonContent>
        <IonLoading
          isOpen={true}
          message={'Please wait...'}
        />
      </IonContent>
    );
  }
  if (isLoggedIn === false) {
    return <Redirect to="/login" />;
  }
  return <Redirect to={acceptedTerms? '/tabs' : '/terms'} />;
};

export default connect<{}, StateProps, {}>({
  mapStateToProps: (state) => ({
    isLoggedIn: state.user.isLoggedIn,
    acceptedTerms: state.user.acceptedTerms,
    loading: state.user.loading,
  }),
  component: HomeOrLogin
});
