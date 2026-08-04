// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/5/LICENSE

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
  "use strict";

  CodeMirror.defineSimpleMode = function(name, states) {
    CodeMirror.defineMode(name, function(config) {
      return CodeMirror.simpleMode(config, states);
    });
  };

  CodeMirror.simpleMode = function(config, states) {
    ensureState(states, "start");
    var statesArray = {}, global = states.meta || {};
    for (var state in states) if (state != "meta" && states.hasOwnProperty(state)) {
      var list = statesArray[state] = [], orig = states[state];
      for (var i = 0; i < orig.length; i++) list.push(new Rule(orig[i], states));
    }
    return {
      startState: function() {
        return {state: "start", pending: null,
                localState: null, stack: global.forceContext ? [] : null};
      },
      copyState: function(state) {
        var s = {state: state.state, pending: state.pending,
                 localState: state.localState && CodeMirror.copyState(statesArray[state.state].localMode, state.localState),
                 stack: state.stack && state.stack.slice(0)};
        if (state.indent) s.indent = state.indent.slice(0);
        return s;
      },
      token: token,
      indent: indent,
      innerMode: function(state) { var m = statesArray[state.state].localMode; return m && {state: state.localState, mode: m}; },
      blockCommentStart: global.blockCommentStart,
      blockCommentEnd: global.blockCommentEnd,
      blockCommentContinue: global.blockCommentContinue,
      lineComment: global.lineComment,
      fold: global.fold
    };
  };

  function ensureState(states, name) {
    if (!states.hasOwnProperty(name))
      throw new Error("Undefined state " + name + " in simple mode");
  }

  function Rule(data, states) {
    if (data.next || data.push) ensureState(states, data.next || data.push);
    this.regex = data.regex;
    this.token = data.token;
    this.indent = data.indent;
    this.dedent = data.dedent;
    this.dedentIfLineStart = data.dedentIfLineStart;
    this.next = data.next;
    this.push = data.push;
    this.pop = data.pop;
    this.mode = data.mode && CodeMirror.getMode(config, data.mode);
    this.indentAfter = data.indentAfter !== false;
  }

  function token(stream, state) {
    if (state.pending) {
      var t = state.pending.shift();
      if (state.pending.length == 0) state.pending = null;
      stream.pos += t.text.length;
      return t.token;
    }

    var curState = statesArray[state.state];
    if (curState.localMode) {
      var tok = curState.localMode.token(stream, state.localState);
      if (curState.localEnd && stream.match(curState.localEnd)) {
        state.state = curState.localContinue;
        state.localState = state.localMode = null;
      }
      return tok;
    }
    for (var i = 0; i < curState.length; i++) {
      var rule = curState[i];
      if (rule.dedentIfLineStart && stream.sol()) {
        var m = stream.match(rule.regex);
        if (m) {
          if (rule.next) state.state = rule.next;
          return rule.token;
        }
      }
      var m = stream.match(rule.regex);
      if (m) {
        if (rule.push) {
          (state.stack || (state.stack = [])).push(state.state);
          state.state = rule.push;
        } else if (rule.pop && state.stack && state.stack.length) {
          state.state = state.stack.pop();
        } else if (rule.next) {
          state.state = rule.next;
        }
        if (rule.mode) {
          state.localMode = rule.mode;
          state.localState = CodeMirror.startState(rule.mode, stream.indentation());
        }
        if (rule.indent) (state.indent || (state.indent = [])).push(stream.indentation() + config.indentUnit);
        if (rule.dedent) (state.indent || (state.indent = [])).pop();
        var token = rule.token;
        if (typeof token == "function") token = token(m);
        if (m.length > 1 && rule.token && typeof rule.token != "string") {
          state.pending = [];
          for (var j = 2; j < m.length; j++)
            if (m[j]) state.pending.push({text: m[j], token: rule.token[j - 1]});
          stream.pos -= m[1].length;
          for (var j = 1; j < m.length; j++) stream.pos += (m[j] ? m[j].length : 0);
          return rule.token[0];
        }
        return token;
      }
    }
    stream.next();
    return null;
  }

  function indent(state, textAfter) {
    var curState = statesArray[state.state];
    if (state.localMode) return state.localMode.indent(state.localState, textAfter);
    if (state.indent == null || state.localMode || (curState.meta && curState.meta.dontIndentStates && curState.meta.dontIndentStates.indexOf(state.state) > -1)) return CodeMirror.Pass;
    var i = state.indent.length - 1;
    if (i < 0) return 0;
    return state.indent[i];
  }
});