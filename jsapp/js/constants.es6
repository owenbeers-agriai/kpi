/**
 * A list of all shareable constants for the application.
 */

/**
 * An enum creator function. Will create a frozen object of `foo: "foo"` pairs.
 * Will make sure the returned values are unique.
 *
 * @param {string[]} values
 * @returns {object}
 */
export function createEnum(values) {
  const newEnum = {};
  new Set(values).forEach((value) => {newEnum[value] = value;});
  return Object.freeze(newEnum);
}

export const ROOT_URL = (() => {
  // This is an "absolute path reference (a URL without the domain name)"
  // according to the Django docs
  let rootPath = document.head.querySelector('meta[name=kpi-root-path]');
  if (rootPath === null) {
    console.error('no kpi-root-path meta tag set. defaulting to ""');
    rootPath = '';
  } else {
    // Strip trailing slashes
    rootPath = rootPath.content.replace(/\/*$/, '');
  }
  return `${window.location.protocol}//${window.location.host}${rootPath}`;
})();

export const ANON_USERNAME = 'AnonymousUser';

/**
 * BAD CODE™ A hardcoded list of permissions codenames.
 *
 * All of them are really defined on backend, and we get them through the
 * permissions config endpoint, but as we need these names to reference them in
 * the code to build the UI it's a necessary evil.
 *
 * NOTE: to know what these permissions permit see `kpi/permissions.py` file,
 * where you have to match the classes with endpoints and their HTTP methods.
 */
export const PERMISSIONS_CODENAMES = createEnum([
  'view_asset',
  'change_asset',
  'discover_asset',
  'manage_asset',
  'add_submissions',
  'view_submissions',
  'partial_submissions',
  'change_submissions',
  'delete_submissions',
  'validate_submissions',
]);

export const ENKETO_ACTIONS = createEnum([
  'edit',
  'view',
])

export const HOOK_LOG_STATUSES = {
  SUCCESS: 2,
  PENDING: 1,
  FAILED: 0,
};

export const KEY_CODES = Object.freeze({
  TAB: 9,
  ENTER: 13,
  ESC: 27,
  SPACE: 32,
  NBSP: 160, // non-breakable space
});

export const MODAL_TYPES = {
  SHARING: 'sharing',
  UPLOADING_XLS: 'uploading-xls',
  NEW_FORM: 'new-form',
  LIBRARY_NEW_ITEM: 'library-new-item',
  LIBRARY_TEMPLATE: 'library-template',
  LIBRARY_COLLECTION: 'library-collection',
  LIBRARY_UPLOAD: 'library-upload',
  ENKETO_PREVIEW: 'enketo-preview',
  SUBMISSION: 'submission',
  REPLACE_PROJECT: 'replace-project',
  TABLE_COLUMNS: 'table-columns',
  REST_SERVICES: 'rest-services',
  FORM_LANGUAGES: 'form-languages',
  FORM_TRANSLATIONS_TABLE: 'form-translation-table',
  ASSET_TAGS: 'asset-tags',
  ENCRYPT_FORM: 'encrypt-form',
  BULK_EDIT_SUBMISSIONS: 'bulk-edit-submissions',
};

export const PROJECT_SETTINGS_CONTEXTS = Object.freeze({
  NEW: 'newForm',
  EXISTING: 'existingForm',
  REPLACE: 'replaceProject',
  BUILDER: 'formBuilderAside',
});

export const update_states = {
  UNSAVED_CHANGES: -1,
  UP_TO_DATE: true,
  PENDING_UPDATE: false,
  SAVE_FAILED: 'SAVE_FAILED',
};

export const AVAILABLE_FORM_STYLES = [
  {value: '', label: t('Default - single page')},
  {value: 'theme-grid no-text-transform', label: t('Grid theme')},
  {value: 'theme-grid', label: t('Grid theme with headings in ALL CAPS')},
  {value: 'pages', label: t('Multiple pages')},
  {value: 'theme-grid pages no-text-transform', label: t('Grid theme + Multiple pages')},
  {value: 'theme-grid pages', label: t('Grid theme + Multiple pages + headings in ALL CAPS')},
];

export const VALIDATION_STATUSES = {
  no_status: {
    value: null,
    label: '—',
  },
  validation_status_not_approved: {
    value: 'validation_status_not_approved',
    label: t('Not approved'),
  },
  validation_status_approved: {
    value: 'validation_status_approved',
    label: t('Approved'),
  },
  validation_status_on_hold: {
    value: 'validation_status_on_hold',
    label: t('On hold'),
  },
};

export const VALIDATION_STATUSES_LIST = [
  VALIDATION_STATUSES.no_status,
  VALIDATION_STATUSES.validation_status_not_approved,
  VALIDATION_STATUSES.validation_status_approved,
  VALIDATION_STATUSES.validation_status_on_hold,
];

export const ASSET_TYPES = {
  question: {
    id: 'question',
    label: t('question'),
  },
  block: {
    id: 'block',
    label: t('block'),
  },
  template: {
    id: 'template',
    label: t('template'),
  },
  survey: {
    id: 'survey',
    label: t('project'),
  },
  collection: {
    id: 'collection',
    label: t('collection'),
  },
};

export const ASSET_FILE_TYPES = {
  map_layer: {
    id: 'map_layer',
    label: t('map layer'),
  },
  form_media: {
    id: 'form_media',
    label: t('form media'),
  },
};

/**
 * When adding new question type please remember to update those places:
 * 1. Add question type here
 * 2. Add new SVG icon to jsapp/svg-icons
 * 3. Add icon to row view.icons.coffee
 * 4. If it's non-regular type, you might need to update:
 *   - isRowSpecialLabelHolder in assetUtils.es6
 *   - renderQuestionTypeIcon in assetUtils.es6
 * 5. If question doesn't hold data, update:
 *   - getDisplayData in bulkEditSubmissionsForm.es6
 *   - getDisplayedColumns in table.es6
 * 6. Update renderResponseData in submissionDataTable.es6
 * 7. Update getSubmissionDisplayData in submissionUtils.es6
 * 8. If it's media type update renderAttachment in submissionDataTable.es6
 */
export const QUESTION_TYPES = Object.freeze({
  acknowledge: {label: t('Acknowledge'), icon: 'qt-acknowledge', id: 'acknowledge'},
  audio: {label: t('Audio'), icon: 'qt-audio', id: 'audio'},
  barcode: {label: t('Barcode / QR Code'), icon: 'qt-barcode', id: 'barcode'},
  calculate: {label: t('Calculate'), icon: 'qt-calculate', id: 'calculate'},
  date: {label: t('Date'), icon: 'qt-date', id: 'date'},
  datetime: {label: t('Date & time'), icon: 'qt-date-time', id: 'datetime'},
  decimal: {label: t('Decimal'), icon: 'qt-decimal', id: 'decimal'},
  'external-xml': {label: t('External XML'), icon: 'qt-external-xml', id: 'external-xml'},
  file: {label: t('File'), icon: 'qt-file', id: 'file'},
  geopoint: {label: t('Point'), icon: 'qt-point', id: 'geopoint'},
  geoshape: {label: t('Area'), icon: 'qt-area', id: 'geoshape'},
  geotrace: {label: t('Line'), icon: 'qt-line', id: 'geotrace'},
  hidden: {label: t('Hidden'), icon: 'qt-hidden', id: 'hidden'},
  image: {label: t('Photo'), icon: 'qt-photo', id: 'image'},
  integer: {label: t('Number'), icon: 'qt-number', id: 'integer'},
  kobomatrix: {label: t('Question Matrix'), icon: 'qt-question-matrix', id: 'kobomatrix'},
  note: {label: t('Note'), icon: 'qt-note', id: 'note'},
  range: {label: t('Range'), icon: 'qt-range', id: 'range'},
  rank: {label: t('Ranking'), icon: 'qt-ranking', id: 'rank'},
  score: {label: t('Rating'), icon: 'qt-rating', id: 'score'},
  select_multiple: {label: t('Select Many'), icon: 'qt-select-many', id: 'select_multiple'},
  select_one: {label: t('Select One'), icon: 'qt-select-one', id: 'select_one'},
  text: {label: t('Text'), icon: 'qt-text', id: 'text'},
  time: {label: t('Time'), icon: 'qt-time', id: 'time'},
  video: {label: t('Video'), icon: 'qt-video', id: 'video'},
});

export const META_QUESTION_TYPES = createEnum([
  'start',
  'end',
  'today',
  'username',
  'simserial',
  'subscriberid',
  'deviceid',
  'phonenumber',
  'audit',
  'background-audio',
]);

// submission data extras being added by backend. see both of these:
// 1. https://github.com/kobotoolbox/kobocat/blob/78133d519f7b7674636c871e3ba5670cd64a7227/onadata/apps/viewer/models/parsed_instance.py#L242-L260
// 2. https://github.com/kobotoolbox/kpi/blob/7db39015866c905edc645677d72b9c1ea16067b1/jsapp/js/constants.es6#L284-L294
export const ADDITIONAL_SUBMISSION_PROPS = createEnum([
  // match the ordering of (Python) kpi.models.import_export_task.ExportTask.COPY_FIELDS
  '_id',
  '_uuid',
  '_submission_time',
  '_validation_status',
  '_notes',
  '_status',
  '_submitted_by',
  '_tags',
  '_index',
]);

/**
 * Submission data that has numerical values. Useful for displaying data with
 * monospaced font. This includes QUESTION_TYPES, META_QUESTION_TYPES and
 * ADDITIONAL_SUBMISSION_PROPS.
 */
export const NUMERICAL_SUBMISSION_PROPS = createEnum([
  QUESTION_TYPES.barcode.id,
  QUESTION_TYPES.date.id,
  QUESTION_TYPES.datetime.id,
  QUESTION_TYPES.decimal.id,
  QUESTION_TYPES.geopoint.id,
  QUESTION_TYPES.geoshape.id,
  QUESTION_TYPES.geotrace.id,
  QUESTION_TYPES.integer.id,
  QUESTION_TYPES.score.id,
  QUESTION_TYPES.time.id,
  META_QUESTION_TYPES.start,
  META_QUESTION_TYPES.end,
  META_QUESTION_TYPES.today,
  META_QUESTION_TYPES.simserial,
  META_QUESTION_TYPES.subscriberid,
  META_QUESTION_TYPES.deviceid,
  META_QUESTION_TYPES.phonenumber,
  ADDITIONAL_SUBMISSION_PROPS._id,
  ADDITIONAL_SUBMISSION_PROPS._uuid,
  ADDITIONAL_SUBMISSION_PROPS._submission_time,
]);

export const NAME_MAX_LENGTH = 255;

/**
 * for Backend calls, see their definitions at `kpi/filters.py`
 * NOTE: ORs require a parenthesis to work
 */
export const COMMON_QUERIES = Object.freeze({
  b: 'asset_type:block',
  q: 'asset_type:question',
  t: 'asset_type:template',
  s: 'asset_type:survey',
  c: 'asset_type:collection',
  qb: '(asset_type:question OR asset_type:block)',
  qbt: '(asset_type:question OR asset_type:block OR asset_type:template)',
  qbtc: '(asset_type:question OR asset_type:block OR asset_type:template OR asset_type:collection)',
});

export const ACCESS_TYPES = createEnum([
  'owned',
  'shared',
  'public',
  'subscribed',
]);

export const GROUP_TYPES_BEGIN = createEnum([
  'begin_group',
  'begin_score',
  'begin_rank',
  'begin_kobomatrix',
  'begin_repeat',
]);

export const GROUP_TYPES_END = createEnum([
  'end_group',
  'end_score',
  'end_rank',
  'end_kobomatrix',
  'end_repeat',
]);

// a custom question type for score
export const SCORE_ROW_TYPE = 'score__row';

// a custom question type for rank
export const RANK_LEVEL_TYPE = 'rank__level';

export const CHOICE_LISTS = Object.freeze({
  SELECT: 'select_from_list_name',
  MATRIX: 'kobo--matrix_list',
  SCORE: 'kobo--score-choices',
  RANK: 'kobo--rank-items',
});

export const MATRIX_PAIR_PROPS = {
  inSurvey: CHOICE_LISTS.MATRIX,
  inChoices: 'list_name',
};

export const DEPLOYMENT_CATEGORIES = Object.freeze({
  Deployed: {id: 'Deployed', label: t('Deployed')},
  Draft: {id: 'Draft', label: t('Draft')},
  Archived: {id: 'Archived', label: t('Archived')},
});

export const QUERY_LIMIT_DEFAULT = 5000;

// List of server routes
export const PATHS = Object.freeze({
  LOGIN: '/accounts/login',
});

// List of React app routes (the # ones)
export const ROUTES = Object.freeze({
  ACCOUNT_SETTINGS: '/account-settings',
  CHANGE_PASSWORD: '/change-password',
  LIBRARY: '/library',
  MY_LIBRARY: '/library/my-library',
  PUBLIC_COLLECTIONS: '/library/public-collections',
  NEW_LIBRARY_ITEM: '/library/asset/new',
  LIBRARY_ITEM: '/library/asset/:uid',
  EDIT_LIBRARY_ITEM: '/library/asset/:uid/edit',
  NEW_LIBRARY_CHILD: '/library/asset/:uid/new',
  LIBRARY_ITEM_JSON: '/library/asset/:uid/json',
  LIBRARY_ITEM_XFORM: '/library/asset/:uid/xform',
  FORMS: '/forms',
  FORM: '/forms/:uid',
  FORM_JSON: '/forms/:uid/json',
  FORM_XFORM: '/forms/:uid/xform',
  FORM_EDIT: '/forms/:uid/edit',
  FORM_SUMMARY: '/forms/:uid/summary',
  FORM_LANDING: '/forms/:uid/landing',
  FORM_DATA: '/forms/:uid/data',
  FORM_REPORT: '/forms/:uid/data/report',
  FORM_TABLE: '/forms/:uid/data/table',
  FORM_DOWNLOADS: '/forms/:uid/data/downloads',
  FORM_GALLERY: '/forms/:uid/data/gallery',
  FORM_MAP: '/forms/:uid/data/map',
  FORM_MAP_BY: '/forms/:uid/data/map/:viewby',
  FORM_SETTINGS: '/forms/:uid/settings',
  FORM_MEDIA: '/forms/:uid/settings/media',
  FORM_SHARING: '/forms/:uid/settings/sharing',
  FORM_REST: '/forms/:uid/settings/rest',
  FORM_REST_HOOK: '/forms/:uid/settings/rest/:hookUid',
  FORM_KOBOCAT: '/forms/:uid/settings/kobocat',
  FORM_RESET: '/forms/:uid/reset',
});

export const COLLECTION_METHODS = Object.freeze({
  offline_url: {
    id: 'offline_url',
    label: t('Online-Offline (multiple submission)'),
    desc: t('This allows online and offline submissions and is the best option for collecting data in the field.'),
  },
  url: {
    id: 'url',
    label: t('Online-Only (multiple submissions)'),
    desc: t('This is the best option when entering many records at once on a computer, e.g. for transcribing paper records.'),
  },
  single_url: {
    id: 'single_url',
    label: t('Online-Only (single submission)'),
    desc: t('This allows a single submission, and can be paired with the "return_url" parameter to redirect the user to a URL of your choice after the form has been submitted.'),
  },
  single_once_url: {
    id: 'single_once_url',
    label: t('Online-only (once per respondent)'),
    desc: t('This allows your web form to only be submitted once per user, using basic protection to prevent the same user (on the same browser & device) from submitting more than once.'),
  },
  iframe_url: {
    id: 'iframe_url',
    label: t('Embeddable web form code'),
    desc: t('Use this html5 code snippet to integrate your form on your own website using smaller margins.'),
  },
  preview_url: {
    id: 'preview_url',
    label: t('View only'),
    desc: t('Use this version for testing, getting feedback. Does not allow submitting data.'),
  },
  android: {
    id: 'android',
    label: t('Android application'),
    desc: t('Use this option to collect data in the field with your Android device.'),
    url: 'https://play.google.com/store/apps/details?id=org.koboc.collect.android&hl=en',
  },
});


export const SURVEY_DETAIL_ATTRIBUTES = Object.freeze({
  value: {
    id: 'value',
  },
  parameters: {
    id: 'parameters',
  },
});

export const FUNCTION_TYPE = Object.freeze({
  function: {
    id: 'function',
  },
});

// NOTE: The default export is mainly for tests
const constants = {
  ROOT_URL,
  ANON_USERNAME,
  PERMISSIONS_CODENAMES,
  HOOK_LOG_STATUSES,
  KEY_CODES,
  MODAL_TYPES,
  PROJECT_SETTINGS_CONTEXTS,
  update_states,
  AVAILABLE_FORM_STYLES,
  VALIDATION_STATUSES,
  VALIDATION_STATUSES_LIST,
  ASSET_TYPES,
  ASSET_FILE_TYPES,
  QUESTION_TYPES,
  META_QUESTION_TYPES,
  ADDITIONAL_SUBMISSION_PROPS,
  NAME_MAX_LENGTH,
  COMMON_QUERIES,
  ACCESS_TYPES,
  GROUP_TYPES_BEGIN,
  GROUP_TYPES_END,
  SCORE_ROW_TYPE,
  RANK_LEVEL_TYPE,
  DEPLOYMENT_CATEGORIES,
  PATHS,
  ROUTES,
  QUERY_LIMIT_DEFAULT,
  CHOICE_LISTS,
  SURVEY_DETAIL_ATTRIBUTES,
  FUNCTION_TYPE,
};

export default constants;
