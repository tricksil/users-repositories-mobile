import React from 'react';
import Proptypes from 'prop-types';
import { Browser } from './styles';

export default function Repository({ navigation, route }) {
  navigation.setOptions({
    title: route.params.repository.name,
  });
  const { repository } = route.params;
  return <Browser source={{ uri: repository.html_url }} />;
}

Repository.propTypes = {
  navigation: Proptypes.shape({
    setOptions: Proptypes.func,
    navigate: Proptypes.func,
  }).isRequired,
  route: Proptypes.shape({
    params: Proptypes.shape({
      repository: Proptypes.shape({
        name: Proptypes.string,
        html_url: Proptypes.string,
      }),
    }),
  }).isRequired,
};
