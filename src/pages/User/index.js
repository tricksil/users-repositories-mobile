/* eslint-disable react/state-in-constructor */
import React, { Component } from 'react';
import Proptypes from 'prop-types';
import api from '../../services/api';

import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
  Loading,
} from './styles';

export default class User extends Component {
  state = {
    stars: [],
    page: 1,
    loading: true,
    refreshing: false,
  };

  async componentDidMount() {
    const { navigation, route } = this.props;
    navigation.setOptions({
      title: route.params.user.name,
    });

    this.loadingData();
  }

  loadingData = async (page = 1) => {
    try {
      const { route } = this.props;
      const { user } = route.params;
      const { stars } = this.state;

      const response = await api.get(`/users/${user.login}/starred`, {
        params: {
          page,
        },
      });

      this.setState({
        stars: page >= 2 ? [...stars, ...response.data] : response.data,
        page,
        loading: false,
        refreshing: false,
      });
    } catch (error) {
      console.tron.log(error.message);
    }
  };

  loadMore = () => {
    const { page } = this.state;
    const nextPage = page + 1;
    this.loadingData(nextPage);
  };

  refreshList = () => {
    this.setState({ refreshing: true, stars: [] }, this.loadingData);
  };

  handleNavigate = (repository) => {
    const { navigation } = this.props;

    navigation.navigate('Repository', { repository });
  };

  render() {
    const { route } = this.props;
    const { stars, loading, refreshing } = this.state;
    const { user } = route.params;
    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>
        {loading ? (
          <Loading />
        ) : (
          <Stars
            data={stars}
            keyExtractor={(item) => String(item.id)}
            onRefresh={this.refreshList}
            refreshing={refreshing}
            onEndReachedThreshold={0.2}
            onEndReached={this.loadMore}
            renderItem={({ item }) => (
              <Starred onPress={() => this.handleNavigate(item)}>
                <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
                <Info>
                  <Title>{item.name}</Title>
                  <Author>{item.owner.login}</Author>
                </Info>
              </Starred>
            )}
          />
        )}
      </Container>
    );
  }
}

User.propTypes = {
  navigation: Proptypes.shape({
    setOptions: Proptypes.func,
    navigate: Proptypes.func,
  }).isRequired,
  route: Proptypes.shape({
    params: Proptypes.shape({
      user: Proptypes.shape({
        name: Proptypes.string,
        login: Proptypes.string,
        avatar: Proptypes.string,
        bio: Proptypes.string,
      }),
    }),
  }).isRequired,
};
