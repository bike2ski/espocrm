/************************************************************************
 * This file is part of EspoCRM.
 *
 * EspoCRM - Open Source CRM application.
 * Copyright (C) 2014-2015 Yuri Kuznetsov, Taras Machyshyn, Oleksiy Avramenko
 * Website: http://www.espocrm.com
 *
 * EspoCRM is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * EspoCRM is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with EspoCRM. If not, see http://www.gnu.org/licenses/.
 *
 * The interactive user interfaces in modified source and object code versions
 * of this program must display Appropriate Legal Notices, as required under
 * Section 5 of the GNU General Public License version 3.
 *
 * In accordance with Section 7(b) of the GNU General Public License version 3,
 * these Appropriate Legal Notices must retain the display of the "EspoCRM" word.
 ************************************************************************/

Espo.define('views/record/panels/bottom', 'view', function (Dep) {

    return Dep.extend({

        template: 'record/panels/side',

        actionList: null,

        buttonList: null,

        defs: null,

        mode: 'detail',

        fieldList: null,

        events: {
            'click .action': function (e) {
                var $el = $(e.currentTarget);
                var action = $el.data('action');
                var method = 'action' + Espo.Utils.upperCaseFirst(action);
                if (typeof this[method] == 'function') {
                    var data = $el.data();
                    this[method](data, e);
                    e.preventDefault();
                }
            }
        },

        data: function () {
            return {
                scope: this.scope,
                name: this.panelName,
                hiddenFields: this.recordHelper.getHiddenFields(),
                fieldList: this.getFieldList(),
            };
        },

        init: function () {
            this.panelName = this.options.panelName;
            this.defs = this.options.defs || {};
            this.recordHelper = this.options.recordHelper;

            this.mode = this.options.mode || this.mode;

            this.buttonList = _.clone(this.defs.buttonList || this.buttonList || []);
            this.actionList = _.clone(this.defs.actionList || this.actionList || []);

            this.fieldList = this.options.fieldList || this.fieldList || [];

            this.fieldList = this.fieldList.map(function (d) {
                var item = d;
                if (typeof item !== 'object') {
                    item = {
                        name: item
                    }
                }
                item = Espo.Utils.clone(item);

                if (this.recordHelper.getFieldStateParam(item.name, 'hidden') !== null) {
                    item.hidden = this.recordHelper.getFieldStateParam(item.name, 'hidden');
                }
                return item;
            }, this);

            this.fieldList = this.fieldList.filter(function (item) {
                if (!item.name) return;
                if (!(item.name in ((this.model.defs || {}).fields) || {})) return;
                return true;
            }, this);
        },

        setup: function () {

        },

        getButtonList: function () {
            return this.buttonList || [];
        },

        getActionList: function () {
            return this.actionList || [];
        },

        actionViewRecord: function (data) {
            var id = data.id;
            var scope = data.scope;

            var viewName = this.getMetadata().get('clientDefs.' + scope + '.modalViews.detail') || 'Modals.Detail';

            this.notify('Loading...');
            this.createView('quickDetail', viewName, {
                scope: scope,
                id: id,
                model: this.collection.get(id),
            }, function (view) {
                view.once('after:render', function () {
                    Espo.Ui.notify(false);
                });
                view.render();
            }.bind(this));
        },

        getFields: function () {
            var fields = {};

            this.getFieldList().forEach(function (item) {
                if (this.hasView(item.name)) {
                    fields[item.name] = this.getView(item.name);
                }
            }, this);
            return fields;
        },

        getFieldList: function () {
            return this.fieldList.map(function (item) {
                if (typeof item !== 'object') {
                    return {
                        name: item
                    };
                }
                return item;
            }, this);
        },

        createFields: function () {
            this.getFieldList().forEach(function (item) {
                var view = null;
                var field;
                var readOnly = null;
                if (typeof item === 'object') {
                    field = item.name;
                    view = item.view;
                    if ('readOnly' in item) {
                        readOnly = item.readOnly;
                    }
                } else {
                   field = item;
                }
                if (!(field in this.model.defs.fields)) {
                    return;
                }
                this.createField(field, readOnly, view);

            }, this);
        },

        createField: function (field, readOnly, viewName) {
            var type = this.model.getFieldType(field) || 'base';
            viewName = viewName || this.model.getFieldParam(field, 'view') || this.getFieldManager().getViewName(type);

            var o = {
                model: this.model,
                el: this.options.el + ' .field[data-name="' + field + '"]',
                defs: {
                    name: field,
                    params: {},
                },
                mode: this.mode
            };
            if (this.readOnly) {
                o.readOnly = true;
            } else {
                if (readOnly !== null) {
                    o.readOnly = readOnly
                }
            }
            if (this.inlineEditDisabled) {
                o.inlineEditDisabled = true;
            }

            if (this.recordHelper.getFieldStateParam(name, 'hidden')) {
                o.disabled = true;
            }
            if (this.recordHelper.getFieldStateParam(name, 'readOnly')) {
                o.readOnly = true;
            }
            if (this.recordHelper.getFieldStateParam(name, 'required') !== null) {
                o.defs.params.required = this.recordHelper.getFieldStateParam(name, 'required');
            }

            this.createView(field, viewName, o);
        }

    });
});

