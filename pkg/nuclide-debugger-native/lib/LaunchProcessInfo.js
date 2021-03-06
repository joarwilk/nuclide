'use babel';
/* @flow */

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import type {DebuggerInstanceBase} from '../../nuclide-debugger-base';
import type {NuclideUri} from '../../commons-node/nuclideUri';
import type {
  LaunchTargetInfo,
  NativeDebuggerService as NativeDebuggerServiceType,
} from '../../nuclide-debugger-native-rpc/lib/NativeDebuggerService';
import typeof * as NativeDebuggerService
  from '../../nuclide-debugger-native-rpc/lib/NativeDebuggerService';

import invariant from 'assert';
import {
  DebuggerProcessInfo,
  registerConsoleLogging,
} from '../../nuclide-debugger-base';
import {DebuggerInstance} from '../../nuclide-debugger-base';
import {getServiceByNuclideUri} from '../../nuclide-remote-connection';
import {getConfig} from './utils';
import UniversalDisposable from '../../commons-node/UniversalDisposable';

export class LaunchProcessInfo extends DebuggerProcessInfo {
  _launchTargetInfo: LaunchTargetInfo;

  constructor(targetUri: NuclideUri, launchTargetInfo: LaunchTargetInfo) {
    super('lldb', targetUri);
    this._launchTargetInfo = launchTargetInfo;
  }

  supportThreads(): boolean {
    return true;
  }

  async debug(): Promise<DebuggerInstanceBase> {
    const rpcService = this._getRpcService();
    if (typeof this.basepath === 'string') {
      this._launchTargetInfo.basepath = this.basepath;
    }

    let debugSession = null;
    let outputDisposable = registerConsoleLogging(
      'C++ Debugger',
      rpcService.getOutputWindowObservable().refCount(),
    );
    try {
      await rpcService.launch(this._launchTargetInfo);
      // Start websocket server with Chrome after launch completed.
      invariant(outputDisposable);
      debugSession = new DebuggerInstance(
        this,
        rpcService,
        new UniversalDisposable(outputDisposable),
      );
      outputDisposable = null;
    } finally {
      if (outputDisposable != null) {
        outputDisposable.dispose();
      }
    }
    return debugSession;
  }

  supportSingleThreadStepping(): boolean {
    return true;
  }

  _getRpcService(): NativeDebuggerServiceType {
    const debuggerConfig = {
      logLevel: getConfig().serverLogLevel,
      pythonBinaryPath: getConfig().pythonBinaryPath,
      buckConfigRootFile: getConfig().buckConfigRootFile,
    };
    const service: ?NativeDebuggerService
      = getServiceByNuclideUri('NativeDebuggerService', this.getTargetUri());
    invariant(service);
    return new service.NativeDebuggerService(debuggerConfig);
  }
}
