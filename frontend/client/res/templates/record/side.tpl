{{#each panelList}}
<div class="panel panel-default panel-{{name}}{{#if hidden}} hidden{{/if}}{{#if sticked}} sticked{{/if}}" data-name="{{name}}" data-name="{{name}}">
    {{#if label}}
    <div class="panel-heading">
        <div class="pull-right btn-group">
            {{#if buttonList}}
                {{#each buttonList}}
                <button type="button" class="btn btn-default btn-sm action{{#if hidden}} hidden{{/if}}" data-action="{{action}}" data-panel="{{../../name}}" {{#each data}} data-{{@key}}="{{./this}}"{{/each}} title="{{translate title scope=../scope}}">{{#if html}}{{{html}}}{{else}}{{translate label scope=../scope}}{{/if}}</button>
                {{/each}}
            {{/if}}
            {{#if actionList}}
                <button type="button" class="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown">
                    <span class="caret"></span>
                </button>
                <ul class="dropdown-menu">
                    {{#each actionList}}
                    <li><a {{#if link}}href="{{link}}"{{else}}href="javascript:"{{/if}} class="action{{#if hidden}} hidden{{/if}}" {{#if action}} data-panel="{{../../name}}" data-action="{{action}}"{{/if}}{{#each data}} data-{{@key}}="{{./this}}"{{/each}}>{{#if html}}{{{html}}}{{else}}{{translate label scope=../scope}}{{/if}}</a></li>
                    {{/each}}
                </ul>
            {{/if}}
        </div>
        <h4 class="panel-title">
            {{#unless notRefreshable}}
            <span style="cursor: pointer;" class="action" title="{{translate 'clickToRefresh' category='messages'}}" data-action="refresh" data-panel="{{name}}">
            {{/unless}}
            {{title}}
            {{#unless notRefreshable}}
            </span>
            {{/unless}}
        </h4>
    </div>
    {{/if}}
    <div class="panel-body" data-name="{{name}}">
        {{{var name ../this}}}
    </div>
</div>
{{/each}}
