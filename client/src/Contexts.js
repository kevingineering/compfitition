import React from 'react';

import GoalState from './contexts/goals/goalState';
import AlertState from './contexts/alerts/alertState';
import AuthState from './contexts/auth/authState';
import SearchableUsersState from './contexts/searchableUsers/searchableUsersState';
import RequestState from './contexts/requests/requestState';
import FriendState from './contexts/friends/friendState';
import CompetitionState from './contexts/competitions/competitionState';
import InviteState from './contexts/invites/inviteState';

const Contexts = props => {
  return (
    <AuthState>
      <AlertState>
        <GoalState>
          <FriendState>
            <SearchableUsersState>
              <RequestState>
                <CompetitionState>
                  <InviteState>
                    {props.children}
                  </InviteState>
                </CompetitionState>
              </RequestState>
            </SearchableUsersState>
          </FriendState>
        </GoalState>
      </AlertState>
    </AuthState>
  )
}

export default Contexts;