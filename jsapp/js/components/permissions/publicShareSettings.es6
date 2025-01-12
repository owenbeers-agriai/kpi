import React from 'react';
import reactMixin from 'react-mixin';
import autoBind from 'react-autobind';
import Checkbox from 'js/components/common/checkbox';
import mixins from 'js/mixins';
import {actions} from 'js/actions';
import bem from 'js/bem';
import permConfig from 'js/components/permissions/permConfig';
import {buildUserUrl} from 'utils';
import {
  ROOT_URL,
  ANON_USERNAME,
  PERMISSIONS_CODENAMES
} from 'js/constants';
import { dataInterface } from '../../dataInterface.es6';
import { permissionsActions } from '../../actions/permissions.es6';

class PublicShareSettings extends React.Component {
  constructor(props) {
    super(props);
    autoBind(this);
    this.anonCanViewPermUrl = permConfig.getPermissionByCodename(PERMISSIONS_CODENAMES.view_asset).url;
    this.anonCanViewDataPermUrl = permConfig.getPermissionByCodename(PERMISSIONS_CODENAMES.view_submissions).url;
  }
  togglePerms(permCodename) {
    var permission = this.props.publicPerms.filter((perm) => {
      return perm.permission === permConfig.getPermissionByCodename(permCodename).url;
    })[0];
    if (permission) {
      actions.permissions.removeAssetPermission(this.props.uid, permission.url);
    } else {
      actions.permissions.assignAssetPermission(
        this.props.uid, {
          user: buildUserUrl(ANON_USERNAME),
          permission: permConfig.getPermissionByCodename(permCodename).url
        }
      );
    }
  }
  toggleAssetOrgLink(checked, org, asset_uid) {
    const { objectUrl } = this.props
    if (checked) {
      permissionsActions.shareAssetWithOrg(asset_uid, org.org_id)
    } else {
      permissionsActions.unshareAssetWithOrg(asset_uid, org.org_id)
    }
  }
  render () {
    const uid = this.props.uid;
    const url = `${ROOT_URL}/#/forms/${uid}`;

    const anonCanView = this.props.publicPerms.filter((perm) => {return perm.permission === this.anonCanViewPermUrl;})[0];
    const anonCanViewData = this.props.publicPerms.filter((perm) => {return perm.permission === this.anonCanViewDataPermUrl;})[0];

    const { assetOrgs } = this.props
    return (
      <bem.FormModal__item m='permissions'>
        {
          this.props.userOrgs && Array.isArray(this.props.userOrgs)
            ? this.props.userOrgs.map(org => {
              const checked = assetOrgs && assetOrgs.find((assetOrg) => org.org_id === assetOrg.veritree_id) ? true : false
              return (
                <bem.FormModal__item key={org.org_id}>
                  <Checkbox
                    checked={checked}
                    onChange={this.toggleAssetOrgLink.bind(this, !checked, org, uid)}
                    label={`${org.org.name} members can view and add submissions`}
                  />
                </bem.FormModal__item>
            )})
            : null
        }
        <bem.FormModal__item>
          <Checkbox
            checked={anonCanView ? true : false}
            onChange={this.togglePerms.bind(this, 'view_asset')}
            label={t('Anyone can view this form')}
          />
        </bem.FormModal__item>

        { this.props.deploymentActive &&
          <bem.FormModal__item>
            <Checkbox
              checked={anonCanViewData ? true : false}
              onChange={this.togglePerms.bind(this, 'view_submissions')}
              label={t('Anyone can view submissions made to this form')}
            />
          </bem.FormModal__item>
        }

        { anonCanView &&
          <bem.FormModal__item m='shareable-link'>
            <label>
              {t('Shareable link')}
            </label>
            <input type='text' value={url} readOnly />
          </bem.FormModal__item>
        }
      </bem.FormModal__item>
    );
  }
}

reactMixin(PublicShareSettings.prototype, mixins.permissions);

export default PublicShareSettings;
