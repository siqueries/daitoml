(function(datioscience) {

    homeView = Backbone.View.extend({
        events: {

        },
        tagName: "div",
        className: "subnav-report",
        id: "subnav-report",
        initialize: function() {
            _.bindAll(this, 'render');
        },
        render: function() {
            $(this.el).html(Handlebars.templates.home());
            return this;
        }
    });

    noProjectView = Backbone.View.extend({
        events: {
            
        },
        tagName: "div",
        className: "tab-pane fade active in",
        initialize: function() {
            _.bindAll(this, 'render');
        },
        render: function() {
            $(this.el).html(Handlebars.templates.noproject());
            return this;
        }
    });

    projectsView = Backbone.View.extend({
        events: {
            'click .edit-project': 'edit_project',
            'click #start-project': 'new_project'
        },
        tagName: "div",
        className: "subnav-report",
        id: "subnav-report",
        initialize: function() {
            _.bindAll(this, 'render');
            this.collection.bind('reset', this.render);
        },
        render: function() {
            $(this.el).html(Handlebars.templates.projects(this.collection));
            if(this.collection.length == 0){
                $("#project-content").prepend(new datioscience.views.noProjectView().render().el);
            }
            return this;
        },

        edit_project: function(event){
            var id = event.target.id;

        },

        new_project: function(e){
            alert(e);
        }
    });


    projectView = Backbone.View.extend({
        events: {
            'click #new-project': 'new_project',
            'click #start-project': 'new_project'
        },
        tagName: "div",
        className: "",
        id: "",
        initialize: function() {
            _.bindAll(this, 'render');
            this.id = this.options.id;
        },
        render: function() {
            $(this.el).html(Handlebars.templates.project(this.model.attributes));
            return this;
        },
        new_project: function(e){
            alert(e);
        }
    });


    editClassificationProjectView = Backbone.View.extend({
        events: {
            'click #cancel': 'cancel',
            'click #create-project': 'save_project'
        },
        tagName: "div",
        className: "",
        id: "",

        initialize: function() {
            _.bindAll(this, 'render');
        },

        render: function() {
            $(this.el).html(Handlebars.templates.editclassificationproject(this.model.attributes));
            return this;
        },

        cancel: function(e){
            e.preventDefault();
            datioscience.sqr.navigate("/projects", { trigger: true });
        },

        save_project: function(e){
            var $button = $("#create-project");
            var $cancel = $("#cancel");
            var name = $("#name");
            var description = $("#description");
            $button.attr("disabled", true);
            $cancel.attr("disabled", true);
            $button.html("Please a moment...");
            name.attr("disabled", true);
            description.attr("disabled", true);
            this.model.save({
                project_type: "classification",
                description: description.val(),
                name: name.val()}, {
                success: function(model, resp){
                    datioscience.sqr.navigate("/projects", { trigger: true });
                },
                error: function(model, resp){}
            });
            return false;
        }
    });

    newProjectView = Backbone.View.extend({
        events: {
            'click #cancel': 'cancel',
            'click #create-project': 'new_project'
        },
        tagName: "div",
        className: "",
        id: "",
        initialize: function() {
            _.bindAll(this, 'render');
        },
        render: function() {
            $(this.el).html(Handlebars.templates.newproject());
            return this;
        },

        cancel: function(e){
            e.preventDefault();
            // $("#formView").hide().empty().show();
            // $("#projectType").show();
            datioscience.sqr.navigate("/", { trigger: true });
        },

        new_project: function(e){
            var $button = $("#create-project");
            var $cancel = $("#cancel");
            var name = $("#name");
            var description = $("#description");
            $button.attr("disabled", true);
            $cancel.attr("disabled", true);
            $button.html("Please a moment...");
            name.attr("disabled", true);
            description.attr("disabled", true);
            this.model.save({
                    description: description.val(),
                    name: name.val()}, {
                success: function(model, resp){
                    datioscience.sqr.navigate("/", { trigger: true });
                },
                error: function(model, resp){}
            });
            return false;
        }
    });

    datasetsView = Backbone.View.extend({
        events: {
        },
        tagName: "div",
        className: "",
        id: "",
        initialize: function() {
            _.bindAll(this, 'render');
            this.id = this.options.id;
            this.collection.bind('reset', this.render);
        },
        render: function() {
            $(this.el).html(Handlebars.templates.datasets(this.collection));
            return this;
        }
    });

    analysisView = Backbone.View.extend({
        events: {
        },
        tagName: "div",
        className: "",
        id: "",
        initialize: function() {
            _.bindAll(this, 'render');
            this.id = this.options.id;
            this.makeid = datioscience.makeid();
            this.collection.bind('reset', this.render);
        },
        render: function() {
            $(this.el).html(Handlebars.templates.analysis({id: this.id, models: this.collection.models}));
            return this;
        }
    });

    newAnalysisView = Backbone.View.extend({
        events: {
            'click #submit-btn': 'create'
        },
        tagName: "div",
        className: "",
        id: "",
        initialize: function() {
            _.bindAll(this, 'render');
            this.id = this.options.id;
            this.datasets = this.options.datasets;
        },
        render: function() {
            $(this.el).html(Handlebars.templates.new_analysis({project_id: this.id, datasets: this.datasets}));
            return this;
        },
        create: function(e){
            e.preventDefault();
            var project_id = this.id;
            var data = {
                "project_id": this.id,
                "dataset_id": $("#dataset").val(),
                "name": $("#name").val()
            }
            this.model.save(data, {
                success: function(model, resp){
                    datioscience.sqr.navigate("/project/"+project_id+"/analysis", { trigger: true });
                },
                error: function(model, resp){}
            });
        }
    });

    buildAnalysisView = Backbone.View.extend({
        events: {
            'click #data-extraction': 'toggle_data_extraction',
            'click #transformations': 'toggle_transformations',
            'click #sampler': 'toggle_sampler',
            'click #exploration': 'toggle_exploration',
            'click #models': 'toggle_models',
            'click #scoring': 'toggle_scoring',
            'click #save-btn': 'save_btn',
            'click #delete-btn': 'delete_btn'  
        },
        tagName: "div",
        className: "",
        id: "",
        initialize: function() {
            _.bindAll(this, 'render');
            this.id = this.options.id;
            this.make_id = this.options.make_id;
            this.project_id = this.options.project_id;
        },
        render: function() {
            var model = this.model.toJSON();
            $(this.el).html(Handlebars.templates.build({make_id: this.make_id, id: this.id, project_id: this.project_id, model: model}));
            return this;
        },
        save_btn: function(){
            $('#BusyBox').stop(true).animate({ 'margin-bottom': -350, 'opacity': '1' }, { queue: false, duration: 300 });
            datioscience.flag = 1;
        },
        delete_btn: function(){
            $('#BusyBox').stop(true).animate({ 'margin-bottom': -350, 'opacity': '1' }, { queue: false, duration: 300 });
            datioscience.flag = 1;
            $("#" + datioscience.openId).remove();
            jsPlumb.remove(datioscience.openId);
        },
        toggle_data_extraction: function(){
            $("#data-extraction-operators").slideToggle('fast');
        },
        toggle_transformations: function(){
            $("#transformations-operators").slideToggle('fast');
        },
        toggle_sampler: function(){
            $("#sampler-operators").slideToggle('fast');
        },
        toggle_exploration: function(){
            $("#exploration-operators").slideToggle('fast');
        },
        toggle_models: function(){
            $("#models-operators").slideToggle('fast');
        },
        toggle_scoring: function(){
            $("#scoring-operators").slideToggle('fast');
        },

        inputDataSet: function(id, ui, commonA){
            var $newPosX = ui.offset.left - id.offset().left;
            var $newPosY = ui.offset.top - id.offset().top;
            var tmpId = ""+jQuery.now()+"";
            var view = new datioscience.views.inputView({"top": $newPosY, "left": $newPosX, "tmpId": tmpId});
            var htmlView = view.render().el;
            $("#theCanvas").append(htmlView);
            jsPlumb.addEndpoint(tmpId, commonA, {uuid: tmpId});
            //jsPlumb.addEndpoint(htmlView);
            jsPlumb.draggable(htmlView, {
              containment: 'parent'
            });
        },

        aggre: function(id, ui, commonA, commonT){
            var $newPosX = ui.offset.left - id.offset().left;
            var $newPosY = ui.offset.top - id.offset().top;
            var tmpId = ""+jQuery.now()+"";
            var view = new datioscience.views.aggrView({"top": $newPosY, "left": $newPosX, "tmpId": tmpId});
            var htmlView = view.render().el;
            $("#theCanvas").append(htmlView);
            var mp = tmpId + tmpId;
            jsPlumb.addEndpoint(tmpId, commonA, {uuid: tmpId});
            jsPlumb.addEndpoint(tmpId, commonT, {uuid: mp});
            //jsPlumb.addEndpoint(htmlView);
            jsPlumb.draggable(htmlView, {
              containment: 'parent'
            });
        },

        initializeDraggble: function(){

            jsPlumb.ready(function() {
                //jsPlumb.setContainer("theCanvas");
                jsPlumb.makeSource($('.item'), {
                    connector: 'StateMachine'
                });
                jsPlumb.makeTarget($('.item'), {
                    anchor: 'Continuous'
                });
                var html = "<h1>Example</h1>";
                $(".selection_element").draggable({
                    helper: 'clone',
                    revert: false,
                    opacity: 1,
                    helper: function(){ 
                        var view = new datioscience.views.emptyDragView({"top": "", "left": ""});
                        var htmlView = view.render().el;
                        return $(htmlView); 
                    },
                    start: function(e, ui) {
                    },
                    stop: function(e, ui){
                    }
                });
                $("#theCanvas").droppable({
                    accept: '.selection_element',
                    drop: function(event, ui) {
                        //$("#theCanvas").append("hello world!")
                        var dataType = $(ui.draggable).data('type');
                        var title = $(ui.draggable).attr('title');
                        var id = $(ui.draggable).attr("id");
                        var name = $(ui.draggable).attr('name');

                        var connectorHoverStyle = {
                            lineWidth: 1,
                            strokeStyle: "#888",
                            outlineWidth: 1.5,
                            outlineColor: "white"
                        };

                        var endpointHoverStyle = {
                            fillStyle: "#888"
                        };

                        var connectorPaintStyle = {
                            lineWidth: 1,
                            strokeStyle: "#afafaf",
                            joinstyle: "round",
                            outlineColor: "white",
                            outlineWidth: 1.5
                        };
                        var commonA = {
                            connector: [ "Straight", { cornerRadius: 5, alwaysRespectStubs: false, midpoint: 0.5 } ],
                            //connector: ["Straight"],
                            //connectior: ["Bezier", { curviness: 150 }],
                            //connectior: ["State Machine"],
                            anchor: "Right",
                            isSource: true,
                            endpoint: "Dot",
                            connectorStyle: connectorPaintStyle,
                            hoverPaintStyle: endpointHoverStyle,
                            connectorHoverStyle: connectorHoverStyle,
                            connectorOverlays: [
                            [ "Arrow", { width:4, length:7, location:1, id:"arrow" } ],
                            //[ "Label", { label:"Relationship", id:"lblPrimary_" + table.name } ]
                            ],
                            paintStyle: {
                                fillStyle: "#9cbdd1",
                                radius: 4.7
                            }
                        };
                        
                        var commonT = {
                            anchor: ["Left", "Right"],
                            isTarget: true,
                            //isSource: true,
                            endpoint: "Rectangle",
                            maxConnections: 2,
                            connectorStyle: {
                                lineWidth: 1,
                                strokeStyle: "#afafaf",
                                joinstyle: "round",
                                outlineColor: "white",
                                outlineWidth: 1.5
                            },
                            hoverPaintStyle: endpointHoverStyle,
                            connectorHoverStyle: connectorHoverStyle,
                            dropOptions: { hoverClass: "hover", activeClass: "active" },
                            paintStyle: {
                                fillStyle: "#9cbdd1",
                                radius: 4
                            }
                        };
                        var id = $(this);
                        var u = ui
                        
                        switch(dataType){
                            case "datasets":
                                if(name == "input-dataset"){
                                    new datioscience.views.buildAnalysisView().inputDataSet(id, u, commonA);
                                }
                            break;
                            case "transformation":
                                if(name == "aggregation"){
                                    new datioscience.views.buildAnalysisView().aggre(id, u, commonA, commonT);
                                }
                            break;
                        }
                        

                    }
                });

            });

        }
    });

    exploreDatasetView = Backbone.View.extend({
            events: {
            },
            tagName: "div",
            className: "",
            id: "",
            initialize: function() {
                _.bindAll(this, 'render');
                this.id = this.options.id;
                this.project_id = this.options.project_id;
            },
            render: function() {
                var model = this.model.toJSON();
                $(this.el).html(Handlebars.templates.explore({id: this.project_id, model: model}));
                return this;
            }
    });

    modelView = Backbone.View.extend({
        events: {
        },
        tagName: "div",
        className: "",
        id: "",
        initialize: function() {
            _.bindAll(this, 'render');
            this.id = this.options.id;
            this.project_id = this.options.project_id;
            this.make_id = this.options.make_id;
            this.collection.bind('reset', this.render);
        },
        render: function() {
            $(this.el).html(Handlebars.templates.model({models: this.collection.models, make_id: this.make_id, id: this.id, project_id: this.project_id}));
            return this;
        }
    });


    modelsView = Backbone.View.extend({
        events: {
        },
        tagName: "div",
        className: "",
        id: "",
        initialize: function() {
            _.bindAll(this, 'render');
            this.collection.bind('reset', this.render);
        },
        render: function() {
            $(this.el).html(Handlebars.templates.models(this.collection));
            return this;
        }
    });


    newModelView = Backbone.View.extend({
        events: {
            'click #submit-btn': 'algorithms'
        },
        tagName: "div",
        className: "",
        id: "",
        initialize: function() {
            _.bindAll(this, 'render');
            this.id = this.options.id;
            this.analysis_id = this.options.analysis_id;
            this.collection.bind('reset', this.render);
        },
        render: function() {
            $(this.el).html(Handlebars.templates.new_model({models: this.collection.models, project_id: this.id, analysis_id: this.analysis_id}));
            return this;
        },

        algorithms: function(){
            var preprocess = []
            _.each(this.collection.models, function(model){
                var index = model.attributes.index;
                var name = model.attributes.name;
                var include = "yes";
                if($("#include_" + index).is(":checked")){
                    include = "yes";
                }else{
                    include = "no";
                }
                var feature = {
                    "included": include,
                    "impute": $("#impute_" + index).val(),
                    "type": $("#type_" + index).val(),
                    "feature": name
                }
                preprocess.push(feature)

            });
            datioscience.workflow["preprocess"] = preprocess;
            var redirect = "/project/"+this.id+"/analysis/"+this.analysis_id+"/models/new/algorithms/"+datioscience.utils.token();
            datioscience.sqr.navigate(redirect, { trigger: true });
        }
    });


    algorithmsView = Backbone.View.extend({
        events: {
            'click #back-btn': 'preprocess',
            'click #submit-btn': 'parameters',
            'change #target-variable': 'get_target_index'
        },
        tagName: "div",
        className: "",
        id: "",
        initialize: function() {
            _.bindAll(this, 'render');
            this.id = this.options.id;
            this.analysis_id = this.options.analysis_id;
            this.collection.bind('reset', this.render);
        },
        render: function() {
            $(this.el).html(Handlebars.templates.algorithms({models: this.collection.models, project_id: this.id, analysis_id: this.analysis_id}));
            return this;
        },
        preprocess: function(){
            var redirect = "/project/"+this.id+"/analysis/"+this.analysis_id+"/models/new";
            datioscience.sqr.navigate(redirect, { trigger: true });
        },
        get_target_index: function(e){
            var indexes = [];
            var $index = $('#target-variable').find(':selected').data('index');
            datioscience.workflow["target-variable-index"] = $index;
            _.each(this.collection.models, function(feature){
                if(feature.attributes.index != $index){
                    indexes.push(parseInt(feature.attributes.index));
                }
            });
            datioscience.workflow["newToOldIndicesList"] = indexes;
        },
        parameters: function(){
            datioscience.workflow["algorithm"] = {
                "algorithm_name": $("#algorithm-name").val(),
                "target_variable": $("#target-variable").val(),
                "training_fraction": $("#training-fraction").val(),
            };
            //console.log(datioscience.workflow["algorithm"])
            var redirect = "/project/"+this.id+"/analysis/"+this.analysis_id+"/models/new/parameters/"+datioscience.utils.token();
            datioscience.sqr.navigate(redirect, { trigger: true });
        }
    });


    parametersView = Backbone.View.extend({
        events: {
            'click #back-btn': 'algorithms',
            'click #submit-btn': 'build_model'
        },
        tagName: "div",
        className: "",
        id: "",
        initialize: function() {
            _.bindAll(this, 'render');
            this.id = this.options.id;
            this.analysis_id = this.options.analysis_id;
        },
        render: function() {
            var algorithm = datioscience.workflow["algorithm"].algorithm_name;
            $(this.el).html(Handlebars.templates.parameters({project_id: this.id, analysis_id: this.analysis_id, algorithm: algorithm}));
            return this;
        },
        algorithms: function(){
            var redirect = "/project/"+this.id+"/analysis/"+this.analysis_id+"/models/new/algorithms/"+datioscience.utils.token();
            datioscience.sqr.navigate(redirect, { trigger: true });
        },
        build_model: function(){
            var data = {};
            switch(datioscience.workflow["algorithm"].algorithm_name){
                case "RANDOM_FOREST_CLASSIFICATION":
                    data["Num_Trees"] = $("#Num_Trees").val();
                    data["Max_Depth"] = $("#Max_Depth").val();
                    data["Max_Bins"] = $("#Max_Bins").val();
                    data["Impurity"] = $("#Impurity").val();
                    data["Feature_Subset_Strategy"] = $("#Feature_Subset_Strategy").val();
                    data["Seed"] = $("#Seed").val();
                break;
            }
            datioscience.workflow["parameters"] = data;
            var redirect = "/project/"+this.id+"/analysis/"+this.analysis_id+"/models/new/build_model/"+datioscience.utils.token();
            datioscience.sqr.navigate(redirect, { trigger: true });
        }
    });


    buildModelView = Backbone.View.extend({
        events: {
            'click #back-btn': 'parameters',
            'click #submit-btn': 'build_model'
        },
        tagName: "div",
        className: "",
        id: "",
        initialize: function() {
            _.bindAll(this, 'render');
            this.id = this.options.id;
            this.analysis_id = this.options.analysis_id;
        },
        render: function() {
            $(this.el).html(Handlebars.templates.build_model({project_id: this.id, analysis_id: this.analysis_id}));
            return this;
        },

        parameters: function(){
            var redirect = "/project/"+this.id+"/analysis/"+this.analysis_id+"/models/new/parameters/"+datioscience.utils.token();
            datioscience.sqr.navigate(redirect, { trigger: true });
        },

        build_model: function(){
            datioscience.workflow["model_name"] = $("#model_name").val();
            var url = "/api/projects/"+this.id+"/analysis/"+this.analysis_id+"/models/build";
            $.ajax({
                url: url,
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(datioscience.workflow)
            }).done(function(resp, textStatus, xhr) {
            }).fail(function() {
            });

        }


    });


    connectorsView = Backbone.View.extend({
        events: {

        },
        tagName: "div",
        className: "",
        id: "",
        initialize: function() {
            _.bindAll(this, 'render');
            this.id = this.options.id;
        },
        render: function() {
            $(this.el).html(Handlebars.templates.connectors({id: this.id}));
            return this;
        }
    });

    mysqlView = Backbone.View.extend({
        events: {

        },
        tagName: "div",
        className: "",
        id: "",
        initialize: function() {
            _.bindAll(this, 'render');
            this.id = this.options.id;
        },
        render: function() {
            $(this.el).html(Handlebars.templates.mysql({id: this.id}));
            return this;
        }
    });


    uploadView = Backbone.View.extend({
        events: {
            'submit #fileForm': 'upload',
        },
        tagName: "div",
        className: "",
        id: "",
        initialize: function() {
            _.bindAll(this, 'render');
            this.id = this.options.id;
        },
        render: function() {
            $(this.el).html(Handlebars.templates.csv({id: this.id}));
            return this;
        },
        upload: function(e){
            e.preventDefault();
            var formData = new FormData($('#fileForm')[0]);
            console.log($('#fileForm')[0])
            function progressHandlingFunction(e){
                $("#progressb").show();
                if(e.lengthComputable){
                    $(".progress-bar").css({"width": e.loaded + "%"});
                    $(".progress-bar").attr("data-percentage", e.loaded + "%");
                }
            }
            var csrf = $('meta[name=csrf-token]').attr('content');
            var url = "/api/projects/"+this.id+"/file/upload";
            var redirect = "/project/"+this.id+"/datasets";
            $.ajax({
                url: url,  //Server script to process data
                type: 'POST',
                xhr: function() {  // Custom XMLHttpRequest
                    var myXhr = $.ajaxSettings.xhr();
                    if(myXhr.upload){ // Check if upload property exists
                        myXhr.upload.addEventListener('progress',progressHandlingFunction, false); // For handling the progress of the upload
                    }
                    return myXhr;
                },
                //Ajax events
                //beforeSend: beforeSendHandler,
                success: function(e){
                    datioscience.sqr.navigate(redirect, { trigger: true });
                },
                //error: errorHandler,
                // Form data
                data: formData,
                //Options to tell jQuery not to process data or worry about content-type.
                cache: false,
                contentType: false,
                processData: false
            });
        }
    });


    postgresqlView = Backbone.View.extend({
        events: {

        },
        tagName: "div",
        className: "",
        id: "",
        initialize: function() {
            _.bindAll(this, 'render');
            this.id = this.options.id;
        },
        render: function() {
            $(this.el).html(Handlebars.templates.connectors({id: this.id}));
            return this;
        }
    });

    cloudsqlView = Backbone.View.extend({
        events: {

        },
        tagName: "div",
        className: "",
        id: "",
        initialize: function() {
            _.bindAll(this, 'render');
            this.id = this.options.id;
        },
        render: function() {
            $(this.el).html(Handlebars.templates.connectors({id: this.id}));
            return this;
        }
    });


    redshiftView = Backbone.View.extend({
        events: {

        },
        tagName: "div",
        className: "",
        id: "",
        initialize: function() {
            _.bindAll(this, 'render');
            this.id = this.options.id;
        },
        render: function() {
            $(this.el).html(Handlebars.templates.connectors({id: this.id}));
            return this;
        }
    });

    loadingView = Backbone.View.extend({
        tagName: "div",
        className: "loading",
        id: "loading",
        initialize: function() {
            _.bindAll(this, 'render');
        },
        render: function() {
            $(this.el).html(Handlebars.templates.loading());
            return this;
        }
    });






    _.extend(datioscience.views, {
        homeView: homeView,
        projectsView: projectsView,
        noProjectView: noProjectView,
        projectView: projectView,
        newProjectView: newProjectView,
        editClassificationProjectView: editClassificationProjectView,
        datasetsView: datasetsView,
        connectorsView: connectorsView,
        redshiftView: redshiftView,
        cloudsqlView: cloudsqlView,
        postgresqlView: postgresqlView,
        uploadView: uploadView,
        mysqlView: mysqlView,
        analysisView: analysisView,
        newAnalysisView: newAnalysisView,
        modelsView: modelsView,
        modelView: modelView,
        newModelView: newModelView,
        buildModelView: buildModelView,
        parametersView: parametersView,
        algorithmsView: algorithmsView,
        exploreDatasetView: exploreDatasetView,
        loadingView: loadingView,
        buildAnalysisView: buildAnalysisView
    });
}(datioscience));