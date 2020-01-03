import Reflux from 'reflux';
import {hashHistory} from 'react-router';
import searchBoxStore from '../header/searchBoxStore';
import assetUtils from 'js/assetUtils';
import {actions} from 'js/actions';
import {ASSETS_TABLE_COLUMNS} from './assetsTable';

const myLibraryStore = Reflux.createStore({
  /**
   * A method for aborting current XHR fetch request.
   * It doesn't need to be defined upfront, but I'm adding it here for clarity.
   */
  abortFetchData: undefined,

  // TODO make it 100 after development
  PAGE_SIZE: 3,

  DEFAULT_COLUMN: ASSETS_TABLE_COLUMNS.get('last-modified'),

  init() {
    this.data = {
      isFetchingData: false,
      sortColumn: this.DEFAULT_COLUMN,
      isOrderAsc: this.DEFAULT_COLUMN.defaultIsOrderAsc,
      currentPage: 0,
      totalPages: null,
      totalUserAssets: null,
      totalSearchAssets: null,
      assets: []
    };
    this.previousPath = null;

    hashHistory.listen(this.onRouteChange.bind(this));
    this.listenTo(searchBoxStore, this.searchBoxStoreChanged);
    this.listenTo(actions.library.moveToCollection.completed, this.onMoveToCollectionCompleted);
    this.listenTo(actions.library.searchMyLibraryAssets.started, this.onSearchStarted);
    this.listenTo(actions.library.searchMyLibraryAssets.completed, this.onSearchCompleted);
    this.listenTo(actions.library.searchMyLibraryAssets.failed, this.onSearchFailed);
    this.listenTo(actions.resources.loadAsset.completed, this.setAsset);
    this.listenTo(actions.resources.cloneAsset.completed, this.onNewLibraryAsset);
    this.listenTo(actions.resources.deleteAsset.completed, this.onDeleteAssetCompleted);
    this.listenTo(actions.resources.createResource.completed, this.onNewLibraryAsset);
    this.listenTo(actions.resources.updateAsset.completed, this.setAsset);

    this.fetchData();
  },

  onRouteChange(data) {
    // refresh data when navigating into library from other place
    if (
      this.previousPath !== null &&
      this.previousPath.split('/')[1] !== 'library' &&
      data.pathname.split('/')[1] === 'library'
    ) {
      this.fetchData();
    }
    this.previousPath = data.pathname;
  },

  // methods for handling search parameters

  searchBoxStoreChanged() {
    // reset to first page when search changes
    this.data.currentPage = 0;
    this.data.totalPages = null;
    this.data.totalSearchAssets = null;
    this.fetchData();
  },

  // methods for reacting to assets changes

  onMoveToCollectionCompleted(asset) {
    if (assetUtils.isLibraryAsset(asset.asset_type)) {
      // update total root assets after moving asset into/out of collection
      if (asset.parent === null) {
        this.data.totalUserAssets++;
      } else {
        this.data.totalUserAssets--;
      }
      this.fetchData();
    }
  },

  setAsset(asset) {
    if (
      assetUtils.isLibraryAsset(asset.asset_type) &&
      this.data.assets.length !== 0
    ) {
      let wasUpdated = false;
      for (let i = 0; i < this.data.assets.length; i++) {
        if (this.data.assets[i].uid === asset.uid) {
          this.data.assets[i] = asset;
          wasUpdated = true;
          break;
        }
      }
      if (wasUpdated) {
        this.trigger(this.data);
      }
    }
  },

  onDeleteAssetCompleted({uid, assetType}) {
    if (assetUtils.isLibraryAsset(assetType)) {
      const found = this.data.assets.find((asset) => {return asset.uid === uid;});
      if (found) {
        this.data.totalUserAssets--;
        this.fetchData();
      }
      // if not found it is possible it is on other page of results, but it is
      // not important enough to do a data fetch
    }
  },

  onNewLibraryAsset(asset) {
    if (
      assetUtils.isLibraryAsset(asset.asset_type) &&
      asset.parent === null
    ) {
      this.data.totalUserAssets++;
      this.fetchData();
    }
  },

  // methods for handling data fetch

  onSearchStarted(abort) {
    this.abortFetchData = abort;
    this.data.isFetchingData = true;
    this.trigger(this.data);
  },

  onSearchCompleted(response) {
    console.debug('onSearchCompleted', response);

    delete this.abortFetchData;

    this.data.hasNextPage = response.next !== null;
    this.data.hasPreviousPage = response.previous !== null;

    this.data.totalPages = Math.ceil(response.count / this.PAGE_SIZE);

    this.data.assets = response.results;
    this.data.totalSearchAssets = response.count;

    // update total count for the first time and the ones that will get a full count
    if (
      this.data.totalUserAssets === null ||
      searchBoxStore.getSearchPhrase() === ''
    ) {
      this.data.totalUserAssets = this.data.totalSearchAssets;
    }
    this.data.isFetchingData = false;
    this.trigger(this.data);
  },

  onSearchFailed() {
    delete this.abortFetchData;
    this.data.isFetchingData = false;
    this.trigger(this.data);
  },

  // public methods

  setCurrentPage(newCurrentPage) {
    this.data.currentPage = newCurrentPage;
    this.fetchData();
  },

  setOrder(sortColumn, isOrderAsc) {
    if (
      this.data.sortColumn.id !== sortColumn.id ||
      this.data.isOrderAsc !== isOrderAsc
    ) {
      this.data.sortColumn = sortColumn;
      this.data.isOrderAsc = isOrderAsc;
      this.fetchData();
    }
  },

  // the method for fetching new data

  fetchData() {
    if (this.abortFetchData) {
      this.abortFetchData();
    }

    actions.library.searchMyLibraryAssets({
      searchPhrase: searchBoxStore.getSearchPhrase(),
      pageSize: this.PAGE_SIZE,
      page: this.data.currentPage,
      sort: this.data.sortColumn.backendProp,
      order: this.data.isOrderAsc ? -1 : 1
    });
  },
});

export default myLibraryStore;