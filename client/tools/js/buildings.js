function load_company_dropdown() {
    disable_add_buttons(true);
    $('#company').empty();
    $.ajax({
        type: "GET",
        url: "/tools/company_id_and_name",
        success: function(data){
            idAndNames = data['companies'];
            $('#company').append($("<option value=''>Select</option>"));
            for (var i = 0; i < idAndNames.length; i++) {
                $('#company').append($("<option></option>").attr("value", idAndNames[i]['id']).text(idAndNames[i]['name'] + '(' + idAndNames[i]['id'] + ')'));
            }
        }
    });
};

function load_building_dropdown(tag_id, async=true) {
    $('#'+tag_id).empty();
    var dict = {};
    dict["company_id"] = $("#company").val();

    $.ajax({
        type: "GET",
        url: "/tools/buildings_of_company",
        async: async,
        data : dict,
        success: function(data){
            idAndNames = data['buildings'];
            $('#'+tag_id).append($("<option value=''>Select</option>"));
            for (var i = 0; i < idAndNames.length; i++) {
                $('#'+tag_id).append($("<option></option>").attr("value", idAndNames[i]['id']).text(idAndNames[i]['name'] + '(' + idAndNames[i]['id'] + ')'));
            }
        }
    });
};

function load_asset_dropdown(building_tag_id, asset_tag_id, async=true) {
    $('#'+asset_tag_id).empty();
    var dict = {};
    dict["building_id"] = $("#"+building_tag_id).val();

    $.ajax({
        type: "GET",
        url: "/tools/assets_of_building",
        async: async,
        data : dict,
        success: function(data){
            idAndNames = data['assets'];
            $('#'+asset_tag_id).append($("<option value=''>Select</option>"));
            for (var i = 0; i < idAndNames.length; i++) {
                $('#'+asset_tag_id).append($("<option></option>").attr("value", idAndNames[i]['id']).text(idAndNames[i]['name'] + '(' + idAndNames[i]['id'] + ')'));
            }
        }
    });

};

function load_device_dropdown(asset_tag_id, device_tag_id, async=true) {
    $('#'+device_tag_id).empty();
    var dict = {};
    dict["asset_id"] = $("#"+asset_tag_id).val();

    $.ajax({
        type: "GET",
        url: "/tools/devices_of_asset",
        async: async,
        data : dict,
        success: function(data){
            idAndNames = data['devices'];
            if (idAndNames.length == 0) {
                $('#'+device_tag_id).append($("<option value=''>No device present for this asset</option>"));
            }
            else {
                $('#'+device_tag_id).append($("<option value=''>Select</option>"));
                for (var i = 0; i < idAndNames.length; i++) {
                    $('#'+device_tag_id).append($("<option></option>").attr("value", idAndNames[i]['id']).text(idAndNames[i]['name'] + '(' + idAndNames[i]['id'] + ')'));
                }
            }
        }
    });

};

function load_unit_dropdown(unit_tag_id, async=true) {
    $('#'+unit_tag_id).empty();

    $.ajax({
        type: "GET",
        url: "/tools/units_for_point",
        async: async,
        success: function(data){
            idAndNames = data['units'];
            $('#'+unit_tag_id).append($("<option value=''>Select</option>"));
            for (var i = 0; i < idAndNames.length; i++) {
                $('#'+unit_tag_id).append($("<option></option>").attr("value", idAndNames[i]['id']).text(idAndNames[i]['symbol']));
            }
        }
    });

};

function load_asset_type_dropdown(asset_tag_id, async=true) {
    $('#'+asset_tag_id).empty();

    $.ajax({
        type: "GET",
        url: "/tools/asset_types",
        async: async,
        success: function(data){
            idAndNames = data['asset_types'];
            $('#'+asset_tag_id).append($("<option value=''>Select</option>"));
            for (var i = 0; i < idAndNames.length; i++) {
                $('#'+asset_tag_id).append($("<option></option>").attr("value", idAndNames[i]['id']).text(idAndNames[i]['name'] + '(' + idAndNames[i]['id'] + ')'));
            }
        }
    });

};

function read_buildings() {
    $('#building_results').empty();
    if ($("#company").val() == '') {
        disable_add_buttons(true);
        return;
    }

    disable_add_buttons(false);
    var dict = {};
    dict["company_id"] = $("#company").val();
    $.ajax({
        type: "GET",
        url: "/tools/buildings_of_company",
        data : dict,
        success: function(data){
            buildings = data['buildings'];
            if (buildings.length > 0) {
                $('#building_results').append("<br><div class='row-fluid'>" +
                "<span class='col-xl-1'><b>Building Id</b></span>" +
                "<span class='col-xl-2'><b>Name</b></span>" +
                "<span class='col-xl-2'><b>Address</b></span>" +
                "<span class='col-xl-2'><b>Zipcode</b></span>" +
                "<span class='col-xl-2'><b>Service Address</b></span>" +
                "<span class='col-xl-2'><b>Sq Footage</b></span>" +
                "<span class='col-xl-1'><b>Occupancy</b></span>" +
                "<span class='col-xl-1'><b>Consumes Gas</b></span>" +
                "<span class='col-xl-1'><b>Consumes Steam</b></span>" +
                "</div>"
                );
            }

            for (var i = 0; i < buildings.length; i++) {
                var building_id = buildings[i]['id'];
                var building = "<div onclick='read_assets(" + building_id + ")' class='row-fluid' data-toggle='collapse' data-target='#asset_results_" + building_id + "'>" +
                "<span class='col-xl-1'>" + building_id + "</span>" +
                "<span class='col-xl-2'>" + buildings[i]['name'] + "</span>" +
                "<span class='col-xl-2'>" + buildings[i]['address'] + "</span>" +
                "<span class='col-xl-2'>" + buildings[i]['zipcode'] + "</span>" +
                "<span class='col-xl-2'>" + buildings[i]['service_address'] + "</span>" +
                "<span class='col-xl-2'>" + buildings[i]['sq_footage'] + "</span>" +
                "<span class='col-xl-1'>" + buildings[i]['occupancy'] + "</span>" +
                "<span class='col-xl-1'>" + buildings[i]['consumes_gas'] + "</span>" +
                "<span class='col-xl-1'>" + buildings[i]['consumes_steam'] + "</span>" +
                "<span class='col-xl-1' style='cursor: pointer;'><i class='material-icons' onclick='event.stopPropagation();delete_entity(\"/tools/delete_building\", \"building_id\", " + building_id + ", \"" + buildings[i]['name'] + "\"); read_buildings();'>delete</i></span>" +
                "<span class='col-xl-1' style='cursor: pointer;'><i class='material-icons' onclick='set_save_building_modal_as_update(" + building_id + ")' data-toggle='modal' data-target='#save_building_modal'>mode_edit</i></span>" +
                "<span class='col-xl-1' style='cursor: pointer;'><p class='ml-2 btn btn-outline-primary' onclick='go_live_check(\"" + building_id + "\");' data-toggle='modal' data-target='#building_go_live_check_modal'>Go Live Check</p></span>" +
                "</div>" +
                "<div id='asset_results_" + building_id + "' class='ml-4 collapse'></div>";
                $('#building_results').append(building);
            }
        }
    });

    load_building_dropdown('save_asset_building_id');
    load_building_dropdown('save_device_building_id');
    load_building_dropdown('save_point_building_id');
};

function read_assets(building_id) {
    $('#asset_results_'+building_id).empty();
    var dict = {};
    dict["building_id"] = building_id;
    $.ajax({
        type: "GET",
        url: "/tools/assets_of_building",
        data : dict,
        success: function(data){
            assets = data['assets'];
            if (assets.length == 0) {
                $('#asset_results_'+building_id).append('No assets are added for this building.');
            }
            else {
                // Headers
                $('#asset_results_'+building_id).append("<div class='row-fluid'>" +
                    "<span class='col-xl-3'><b>Asset Id</b></span>" +
                    "<span class='col-xl-3'><b>Name</b></span>" +
                    "<span class='col-xl-3'><b>Asset Type</b></span>" +
                    "<span class='col-xl-3'><b>Energy Type</b></span>" +
                    "</div>"
                );

                for (var i = 0; i < assets.length; i++) {
                    var asset_id = assets[i]['id'];
                    var asset = "<div onclick='read_devices_and_points(" + asset_id + ")' class='row-fluid' data-toggle='collapse' data-target='#asset_child_results_" + asset_id + "'>" +
                        "<span class='col-xl-3'>" + asset_id + "</span>" +
                        "<span class='col-xl-3'>" + assets[i]['name'] + "</span>" +
                        "<span class='col-xl-3'>" + assets[i]['asset_type_name'] + "</span>" +
                        "<span class='col-xl-3'>" + assets[i]['energy_type'] + "</span>" +
                        "<span class='col-xl-3' style='cursor: pointer;'><i class='material-icons' onclick='event.stopPropagation();delete_entity(\"/tools/delete_asset\", \"asset_id\", " + asset_id + ", \"" + assets[i]['name'] + "\"); read_assets(" + building_id + ");'>delete</i></span>" +
                        "<span class='col-xl-1' style='cursor: pointer;'><i class='material-icons' onclick='set_save_asset_modal_as_update(" + asset_id + ");' data-toggle='modal' data-target='#save_asset_modal'>mode_edit</i></span>" +
                        "</div>" +
                        "<div id='asset_child_results_" + asset_id + "' class='ml-5 bg-light collapse'></div>";
                    $('#asset_results_'+building_id).append(asset);
                }
                $('#asset_results_'+building_id).append("<br>");
            }
        }
    });
};

function read_devices_and_points(asset_id) {
    $('#asset_child_results_'+asset_id).empty();
    var dict = {};
    dict["asset_id"] = asset_id;
    $.ajax({
        type: "GET",
        url: "/tools/devices_and_points_for_asset",
        data : dict,
        success: function(data){
            points = data['points'];
            devices = data['devices'];
            if (points.length > 0) {
                $('#asset_child_results_'+asset_id).append("<div class='row-fluid'>" +
                    "<span class='col-xl-1'><b>Point Id</b></span>" +
                    "<span class='col-xl-1'><b>Name</b></span>" +
                    "<span class='col-xl-3'><b>Path</b></span>" +
                    "<span class='col-xl-1'><b>Unit</b></span>" +
                    "<span class='col-xl-1'><b>Tag</b></span>" +
                    "</div>"
                );

                for (var i = 0; i < points.length; i++) {
                    var point_id = points[i]['id'];
                    var point = "<div class='row-fluid' data-toggle='collapse' data-target='#asset_child_results_" + point_id + "'>" +
                        "<span class='col-xl-1'>" + point_id + "</span>" +
                        "<span class='col-xl-1'>" + points[i]['name'] + "</span>" +
                        "<span class='col-xl-3'>" + points[i]['path'] + "</span>" +
                        "<span class='col-xl-1'>" + points[i]['unit'] + "</span>" +
                        "<span class='col-xl-1'>" + points[i]['tag'] + "</span>" +
                        "<span class='col-xl-1' style='cursor: pointer;'><i class='material-icons' onclick='event.stopPropagation();delete_entity(\"/tools/delete_point\", \"point_id\", " + point_id + ", \"" + points[i]['name'] + "\");read_points(" + asset_id + ");'>delete</i></span>" +
                        "<span class='col-xl-1' style='cursor: pointer;'><i class='material-icons' onclick='set_save_point_modal_as_update(" + point_id + ")' data-toggle='modal' data-target='#save_point_modal'>mode_edit</i></span>" +
                        "<span class='col-xl-1' style='cursor: pointer;'><p class='ml-2 btn btn-outline-primary' onclick='test_point(\"" + points[i]['path'] + "\");' data-toggle='modal' data-target='#test_point_modal'>Test N4 read</p></span>" +
                        "</div>" +
                        "<div id='asset_child_results_" + point_id + "' class='collapse'></div>";
                    $('#asset_child_results_'+asset_id).append(point);
                }
                $('#asset_child_results_'+asset_id).append('<br>')
            }

            if (devices.length > 0) {
                // Headers
                $('#asset_child_results_'+asset_id).append("<div class='row-fluid'>" +
                    "<span class='col-xl-1'><b>Device Id</b></span>" +
                    "<span class='col-xl-1'><b>Name</b></span>" +
                    "</div>"
                );

                for (var i = 0; i < devices.length; i++) {
                    var device_id = devices[i]['id'];
                    var device = "<div onclick='read_points_for_device(" + device_id + ")' class='row-fluid' data-toggle='collapse' data-target='#device_results_" + device_id + "'>" +
                        "<span class='col-xl-1'>" + device_id + "</span>" +
                        "<span class='col-xl-1'>" + devices[i]['name'] + "</span>" +
                        "<span class='col-xl-1' style='cursor: pointer;'><i class='material-icons' onclick='event.stopPropagation();delete_entity(\"/tools/delete_device\", \"device_id\", " + device_id + ", \"" + devices[i]['name'] + "\");read_devices_and_points(" + asset_id + ");'>delete</i></span>" +
                        "<span class='col-xl-1' style='cursor: pointer;'><i class='material-icons' onclick='set_save_device_modal_as_update(" + device_id + ");' data-toggle='modal' data-target='#save_device_modal'>mode_edit</i></span>" +
                        "</div>" +
                        "<div id='device_results_" + device_id + "' class='collapse'></div>";
                    $('#asset_child_results_'+asset_id).append(device);
                }
            }
        }
    });
};

function read_points(asset_id) {
    $('#asset_child_results_'+asset_id).empty();
    var dict = {};
    dict["asset_id"] = asset_id;
    $.ajax({
        type: "GET",
        url: "/tools/points_of_asset",
        data : dict,
        success: function(data){
            points = data['points'];
            if (points.length == 0) {
                $('#asset_child_results_'+asset_id).append("<div class='row-fluid'>No points are added for this asset.</div>");
            }
            else {
                // Headers
                $('#asset_child_results_'+asset_id).append("<div class='row-fluid'>" +
                    "<span class='col-xl-1'><b>Asset Id</b></span>" +
                    "<span class='col-xl-1'><b>Name</b></span>" +
                    "<span class='col-xl-3'><b>Path</b></span>" +
                    "<span class='col-xl-1'><b>Unit</b></span>" +
                    "<span class='col-xl-1'><b>Tag</b></span>" +
                    "</div>"
                );

                for (var i = 0; i < points.length; i++) {
                    var point_id = points[i]['id'];
                    var point = "<div class='row-fluid' data-toggle='collapse' data-target='#asset_child_results_" + point_id + "'>" +
                        "<span class='col-xl-1'>" + point_id + "</span>" +
                        "<span class='col-xl-1'>" + points[i]['name'] + "</span>" +
                        "<span class='col-xl-3'>" + points[i]['path'] + "</span>" +
                        "<span class='col-xl-1'>" + points[i]['unit'] + "</span>" +
                        "<span class='col-xl-1'>" + points[i]['tag'] + "</span>" +
                        "<span class='col-xl-1' style='cursor: pointer;'><i class='material-icons' onclick='event.stopPropagation();delete_entity(\"/tools/delete_point\", \"point_id\", " + point_id + ", \"" + points[i]['name'] + "\");read_points(" + asset_id + ");'>delete</i></span>" +
                        "<span class='col-xl-1' style='cursor: pointer;'><i class='material-icons' onclick='set_save_point_modal_as_update(" + point_id + ")' data-toggle='modal' data-target='#save_point_modal'>mode_edit</i></span>" +
                        "<span class='col-xl-1' style='cursor: pointer;'><p class='ml-2 btn btn-outline-primary' onclick='test_point(\"" + points[i]['path'] + "\");' data-toggle='modal' data-target='#test_point_modal'>Test N4 read</p></span>" +
                        "</div>" +
                        "<div id='asset_child_results_" + point_id + "' class='collapse'></div>";
                    $('#asset_child_results_'+asset_id).append(point);
                }
            }
        }
    });
};

function read_points_for_device(device_id) {
    $('#device_results_'+device_id).empty();
    var dict = {};
    dict["device_id"] = device_id;
    $.ajax({
        type: "GET",
        url: "/tools/points_of_devices",
        data : dict,
        success: function(data){
            points = data['points'];
            if (points.length == 0) {
                $('#device_results_'+device_id).append("<div class='row-fluid'>No points are added for this asset.</div>");
            }
            else {
                // Headers
                $('#device_results_'+device_id).append("<div class='row-fluid'>" +
                    "<span class='col-xl-1'><b>Point Id</b></span>" +
                    "<span class='col-xl-1'><b>Name</b></span>" +
                    "<span class='col-xl-3'><b>Path</b></span>" +
                    "<span class='col-xl-1'><b>Unit</b></span>" +
                    "<span class='col-xl-1'><b>Tag</b></span>" +
                    "</div>"
                );

                for (var i = 0; i < points.length; i++) {
                    var point_id = points[i]['id'];
                    var point = "<div class='row-fluid'>" +
                        "<span class='col-xl-1'>" + point_id + "</span>" +
                        "<span class='col-xl-1'>" + points[i]['name'] + "</span>" +
                        "<span class='col-xl-3'>" + points[i]['path'] + "</span>" +
                        "<span class='col-xl-1'>" + points[i]['unit'] + "</span>" +
                        "<span class='col-xl-1'>" + points[i]['tag'] + "</span>" +
                        "<span class='col-xl-1' style='cursor: pointer;'><i class='material-icons' onclick='event.stopPropagation();delete_entity(\"/tools/delete_point\", \"point_id\", " + point_id + ", \"" + points[i]['name'] + "\");read_points_for_device(" + device_id + ");'>delete</i></span>" +
                        "<span class='col-xl-1' style='cursor: pointer;'><i class='material-icons' onclick='set_save_point_modal_as_update(" + point_id + ")' data-toggle='modal' data-target='#save_point_modal'>mode_edit</i></span>" +
                        "<span class='col-xl-1' style='cursor: pointer;'><p class='ml-2 btn btn-outline-primary' onclick='test_point(\"" + points[i]['path'] + "\");' data-toggle='modal' data-target='#test_point_modal'>Test N4 read</p></span>" +
                        "</div>";
                    $('#device_results_'+device_id).append(point);
                }
            }
        }
    });
};

function save_building_submit_form() {
    $('#save_building_company_id').val($('#company').val());
    document.getElementById('save_building_submit_error').innerHTML = "";

    $.ajax({
        url: '/tools/save_building',
        data: $('#save_building_form').serialize(),
        type: 'post',
        error: function(jqXHR, textStatus, errorThrown) {
            document.getElementById('save_building_submit_error').innerHTML = jqXHR.responseText;
        },
        success: data => {
            $('#save_building_modal').modal('hide');
            clear_building_modal();
            alert(data);
            read_buildings();
        }
    })
};

function save_asset_submit_form() {
    $('#save_asset_modal').modal('hide');
    $('#save_asset_building_id').prop('disabled', false)
    $.ajax({
        url: '/tools/save_asset',
        data: $('#save_asset_form').serialize(),
        type: 'post',
        error: function(XMLHttpRequest, textStatus, errorThrown){
            alert(XMLHttpRequest.status + ': ' + XMLHttpRequest.responseText);
        },
        success: data => {
            alert(data)
        }
    }).then(data => {
        read_assets($('#save_asset_building_id').val());
        clear_asset_modal();
    });
};

function save_device_submit_form() {
    $('#save_device_modal').modal('hide');
    $('#save_device_building_id').prop('disabled', false)
    $.ajax({
        url: '/tools/save_device',
        data: $('#save_device_form').serialize(),
        type: 'post',
        error: function(XMLHttpRequest, textStatus, errorThrown){
            alert(XMLHttpRequest.status + ': ' + XMLHttpRequest.responseText);
        },
        success: data => {
            alert(data);
        }
    }).then(data => {
        read_devices_and_points($('#save_device_asset_id').val())
        clear_device_modal();
    });
};

function save_point_submit_form() {
    document.getElementById('save_point_submit_error').innerHTML = "";
    $.ajax({
        url: '/tools/save_point',
        data: $('#save_point_form').serialize(),
        type: 'post',
        error: function(jqXHR, textStatus, errorThrown) {
            try {
                var responseJSON = jQuery.parseJSON(jqXHR.responseText);
                if (responseJSON['validation_error']) {
                    document.getElementById('save_point_submit_error').innerHTML = responseJSON['validation_error'];
                } else {
                    document.getElementById('save_point_submit_error').innerHTML = jqXHR.responseText;
                }
            } catch (error) {
                alert(jqXHR.responseText);
            }
        },
        success: data => {
            alert(data);
            $('#save_point_modal').modal('hide');
            clear_point_modal();
            read_devices_and_points($('#save_point_asset_id').val())
        }
    })
};

function delete_entity(delete_url, entity_id_name, entity_id, entity_name) {
    var resp = confirm("Are you sure you want to delete: " + entity_name + "?");
    if (resp == true) {
        var dict = {};
        dict[entity_id_name] = entity_id;

        $.ajax({
            type: "POST",
            url: delete_url,
            data : dict,
            success: function(data){
                alert(data);
            },
            async: false
        });
    }
};

function clear_device_modal() {
    $('#save_device_name').val("");
    $('#save_device_device_id').val("");
    $('#save_device_building_id').val("");
    $('#save_device_asset_id').val("");
};

function clear_asset_modal() {
    // Clear fields
    $('#save_asset_asset_id').val("");
    $('#save_asset_building_id').val("");
    $('#save_asset_asset_name').val("");
    $("#save_asset_asset_type_id").val($("#save_asset_asset_type_id option:first").val());
    $("#save_asset_energy_type").val($("#save_asset_energy_type option:first").val());
};

function clear_building_modal() {
    // Clear fields
    $('#save_building_building_id').val("");
    $('#save_building_building_name').val("");
    $('#save_building_address').val("");
    $('#save_building_zipcode').val("");
    $('#save_building_service_address').val("");
    $('#save_building_sq_footage').val("");
    $('#save_building_occupancy').val("");
    $('#save_building_consumes_gas').prop('checked', false);
    $('#save_building_consumes_steam').prop('checked', false);
}

function set_save_building_modal_as_update(building_id) {
    // Change modal title
    $('#save_building_modal').find('.modal-title').text("Update building " + building_id)
    // Get and set building data
    $('#save_building_building_id').val(building_id);
    $.ajax({
        type: "GET",
        url: "/tools/get_building_attributes",
        async: false,
        data: {'building_id': building_id},
        success: function(data){
            $('#save_building_building_name').val(data['name']);
            $('#save_building_address').val(data['address']);
            $('#save_building_zipcode').val(data['zipcode']);
            $('#save_building_service_address').val(data['service_address']);
            $('#save_building_sq_footage').val(data['sq_footage']);
            $('#save_building_occupancy').val(data['occupancy']);
            $('#save_building_consumes_gas').prop('checked', data['consumes_gas']);
            $('#save_building_consumes_steam').prop('checked', data['consumes_steam']);
        }
    });
}

function set_save_asset_modal_as_update(asset_id) {
    // Change modal title
    $('#save_asset_modal').find('.modal-title').text("Update asset " + asset_id)
    // Get asset data
    asset_data = {}
    $.ajax({
        type: "GET",
        url: "/tools/get_asset_attributes",
        async: false,
        data: {'asset_id': asset_id},
        success: function(data){
            asset_data['name'] = data['name'];
            asset_data['building_id'] = data['building_id'];
            asset_data['energy_type'] = data['energy_type'];
            asset_data['asset_type_id'] = data['asset_type_id'];
        }
    });
    // Set and disable fields
    $('#save_asset_asset_id').val(asset_id);
    load_building_dropdown('save_asset_building_id', async=false);
    $('#save_asset_building_id').val(asset_data['building_id']);
    $('#save_asset_building_id').prop('disabled', true);
    $('#save_asset_asset_name').val(asset_data['name']);
    load_asset_type_dropdown("save_asset_asset_type_id", async=false);
    $('#save_asset_asset_type_id').val(asset_data['asset_type_id'])
    $("#save_asset_energy_type").val(asset_data['energy_type']);
}

function clear_point_modal() {
    // Clear fields
    $('#save_point_name').val("");
    $('#save_point_path').val("");
    $("#save_point_unit").val($("#save_point_unit option:first").val());
    $("#save_point_tag").val($("#save_point_tag option:first").val());
    $("#save_point_asset_type").val($("#save_point_asset_type option:first").val());
    $('#save_point_point_id').val("");
};

function set_save_device_modal_as_update(device_id) {
    // Change modal title
    $('#save_device_modal').find('.modal-title').text("Update device " + device_id)

    // Get Device data
    device_data = {}
    $.ajax({
        type: "GET",
        url: "/tools/get_device_attributes",
        async: false,
        data: {'device_id': device_id},
        success: function(data){
            device_data['name'] = data['name'];
            device_data['asset_id'] = data['asset_id'];
            device_data['building_id'] = data['building_id'];
        }
    });

    // Set and disable fields
    $('#save_device_device_id').val(device_id);
    load_building_dropdown('save_device_building_id', async=false);
    $('#save_device_building_id').val(device_data['building_id']);
    $('#save_device_building_id').prop('disabled', true);
    load_asset_dropdown('save_device_building_id', 'save_device_asset_id', async=false);
    $('#save_device_asset_id').val(device_data['asset_id']);
    $('#save_device_asset_id').prop('disabled', true);
    $('#save_device_name').val(device_data['name']);
};

function set_save_point_modal_as_update(point_id) {
    // Change modal title
    $('#save_point_modal').find('.modal-title').text("Update point " + point_id);
    // Get point data
    point_data = {}
    $.ajax({
        type: "GET",
        url: "/tools/get_point_attributes",
        async: false,
        data: {'point_id': point_id},
        success: function(data){
            point_data['path'] = data['path'];
            point_data['name'] = data['name'];
            point_data['tag'] = data['tag'];
            point_data['unit_id'] = data['unit_id'];
            point_data['device_id'] = data['device_id'];
            point_data['asset_id'] = data['asset_id'];
            point_data['building_id'] = data['building_id'];
        }
    });

    // Set and disable fields
    $('#save_point_point_id').val(point_id);

    load_building_dropdown('save_point_building_id', async=false);
    $('#save_point_building_id').val(point_data['building_id']);
    $('#save_point_building_id').prop('disabled', true);
    load_asset_dropdown('save_point_building_id', 'save_point_asset_id', async=false);
    $('#save_point_asset_id').val(point_data['asset_id']);
    $('#save_point_asset_id').prop('disabled', true);
    load_device_dropdown('save_point_asset_id', 'save_point_device_id', async=false);
    $('#save_point_device_id').val(point_data['device_id']);
    $('#save_point_device_id').prop('disabled', true);

    $('#save_point_name').val(point_data['name']);
    $('#save_point_path').val(point_data['path']);
    $('#save_point_tag').val(point_data['tag']);
    load_unit_dropdown("save_point_unit", async=false)
    $('#save_point_unit').val(point_data['unit_id']);
};

function disable_add_buttons(state_val) {
    $('#add_building').prop('disabled', state_val);
    $('#add_asset').prop('disabled', state_val);
    $('#add_device').prop('disabled', state_val);
    $('#add_point').prop('disabled', state_val);
};

function test_point(point_path) {
    var dict = {};
    dict["point_path"] = point_path;
    $('#test_point_modal').find('.modal-title').text("Testing point " + point_path);
    document.getElementById('test_point_modal_text').innerHTML = "Testing point configuration, this can take up to 60s.";

    $.ajax({
        type: "GET",
        url: "/tools/test_point_read",
        data : dict,
        success: function(data, testStatus, jqXHR){
            try {
                var responseJSON = jQuery.parseJSON(jqXHR.responseText);
                document.getElementById('test_point_modal_text').innerHTML = responseJSON['message'];
            } catch (error) {
                document.getElementById('test_point_modal_text').innerHTML = jqXHR.responseText;
            }
        },
        error: function(jqXHR){
            try {
                var responseJSON = jQuery.parseJSON(jqXHR.responseText);
                document.getElementById('test_point_modal_text').innerHTML = responseJSON['validation_error'];
            } catch (error) {
                document.getElementById('test_point_modal_text').innerHTML = jqXHR.responseText;
            }
        }
        
    });
}


function go_live_check(building_id) {
    var dict = {};
    dict["building_id"] = building_id;
    $('#building_go_live_check_modal').find('.modal-title').text("Checking if building is ready for go live: " + building_id);
    document.getElementById('building_go_live_check_modal_text').innerHTML = "Testing point configuration, this can take up to 60s.";

    $.ajax({
        type: "GET",
        url: "/tools/go_live_ready",
        data : dict,
        success: function(data, testStatus, jqXHR){
            var responseJSON = jQuery.parseJSON(jqXHR.responseText);
            document.getElementById('building_go_live_check_modal_text').innerHTML = responseJSON['message'];
        }
    });
}