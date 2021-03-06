'use babel';
/* @flow */

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import type {
  AppState,
  CommitState,
  EditorState,
  FileDiffState,
  PublishState,
  RepositoryState,
} from '../types';

import {
  CommitMode,
  CommitModeState,
  DiffMode,
  PublishMode,
  PublishModeState,
} from '../constants';


export function getEmptyCommitState(): CommitState {
  return {
    message: null,
    mode: CommitMode.COMMIT,
    state: CommitModeState.READY,
  };
}

export function getEmptyPublishState(): PublishState {
  return {
    message: null,
    mode: PublishMode.CREATE,
    state: PublishModeState.READY,
  };
}

function initialEditorState(): EditorState {
  return {
    revisionTitle: 'No file selected',
    text: '',
    offsets: new Map(),
    highlightedLines: {
      added: [],
      removed: [],
    },
    inlineElements: new Map(),
    inlineOffsetElements: new Map(),
  };
}

export function getEmptyFileDiffState(): FileDiffState {
  return {
    filePath: '',
    lineMapping: {oldToNew: [], newToOld: []},
    newEditorState: initialEditorState(),
    oldEditorState: initialEditorState(),
    navigationSections: [],
  };
}


export function getEmptyRepositoryState(): RepositoryState {
  return {
    revisionStatuses: new Map(),
    dirtyFiles: new Map(),
    headToForkBaseRevisions: [],
    isLoadingSelectedFiles: false,
    compareRevisionId: null,
    selectedFiles: new Map(),
  };
}

export function createEmptyAppState(): AppState {
  return {
    activeRepository: null,
    commit: getEmptyCommitState(),
    cwdApi: null,
    fileDiff: getEmptyFileDiffState(),
    isLoadingFileDiff: false,
    publish: getEmptyPublishState(),
    repositories: new Map(),
    shouldRebaseOnAmend: true,
    uiProviders: [],
    viewMode: DiffMode.BROWSE_MODE,
  };
}
