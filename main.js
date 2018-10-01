function alarm(data)
{
    alert(JSON.stringify(data, null, 8));
}

function add_person(btn)
{
    let max_num = {"leaders": 3, "teammates": 9, "observers": 5};
    let parent_elem = btn.parentNode.parentNode;
    let elem_list = parent_elem.getElementsByClassName('person');
    let old_elem = elem_list[elem_list.length-1];
    let city_n = old_elem.getElementsByTagName('select')[0].selectedIndex;
    let school = old_elem.getElementsByTagName('input')[8].value;
    let new_elem = old_elem.cloneNode(true);
    let pos_min = new_elem.id.indexOf('-') + 1;
    let n = Number(new_elem.id.substring(pos_min)) + 1;
    if (n > max_num[parent_elem.className]) return;
    new_elem.id = new_elem.id.substring(0, pos_min) + n;
    var inputs = new_elem.getElementsByTagName('input');
    for (let i in inputs) { inputs[i].value = ''; }
    new_elem.getElementsByTagName('select')[0].selectedIndex = city_n;
    new_elem.getElementsByTagName('input')[8].value = school;
    let add_del_elem = parent_elem.getElementsByClassName('add-del-btn')[0];
    parent_elem.insertBefore(new_elem, add_del_elem);
}

function del_person(btn)
{
    let min_num = {"leaders": 1, "teammates": 3, "observers": 1};
    let parent_elem = btn.parentNode.parentNode;
    let elem_list = parent_elem.getElementsByClassName('person');
    let del_elem = elem_list[elem_list.length-1];
    let pos_min = del_elem.id.indexOf('-') + 1;
    let n = Number(del_elem.id.substring(pos_min)) - 1;
    if (n < min_num[parent_elem.className]) return;
    parent_elem.removeChild(del_elem);
}

function file_to_base64(file)
{
    if (file === undefined) return "";

    return new Promise((resolve) =>
    {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => { resolve(reader.result); };
    });
}

async function read_person(arr_inputs, person_type, i)
{
    let inputs  = arr_inputs.getElementsByTagName('input');
    let selects = arr_inputs.getElementsByTagName('select');
    let person = {};
    
    person.type        = person_type;
    person.photo       = await file_to_base64(inputs[0].files[0]);
    person.first_name  = inputs[1].value;
    person.father_name = inputs[2].value;
    person.last_name   = inputs[3].value;
    person.birthdate   = inputs[4].value;
    person.email       = inputs[5].value;
    person.phone_num   = inputs[6].value;
    person.ref_to_vk   = inputs[7].value;
    person.school      = inputs[8].value;

    let i_0 = selects[0].selectedIndex;
    let i_1 = selects[1].selectedIndex;

    person.city     = (i_0 > 0) ? selects[0].options[i_0].text : "";
    let last_field  = (i_1 > 0) ? selects[1].options[i_1].text : "";
    
    if (person_type === "leader")
    {
        person.position = last_field;
    };
    
    if (person_type === "teammate")
    {
        person.grade = last_field;
        if (i === 0) person.type = "captain";
    };
    
    if (person_type === "observer") 
    {
        person.role = last_field;
        if (i_1 === 2) person.type = "escort";
    };
    
    return person;
}

function format_phone_number(str)
{
    return ("+7 (" + str.slice(1, 4) + ") " + str.slice(4, 7) +
            "-" + str.slice(7, 9) + "-" + str.slice(9, 11));
}

function get_arr_inputs_by_class(type)
{
    return document.getElementsByClassName(type)[0]
                   .getElementsByClassName('person');
}

async function arr_inputs_to_arr_objs(arr_inputs, person_type)
{
    let arr_objs = [];
    
    for (let i = 0; i < arr_inputs.length; ++i)
    {
        arr_objs.push(await read_person(arr_inputs[i], person_type, i));
    }
    
    return arr_objs;
}

async function arr_inputs_to_obj_data(arr_inputs)
{
    let data = {};
    
    data.name     = arr_inputs[0].value;
    data.solution = await file_to_base64(arr_inputs[1].files[0]);
    data.photo    = await file_to_base64(arr_inputs[2].files[0]);
    
    return data;
}

function get_required_fields(person_type)
{
    let required_fields =
    {
        "leader":   ["first_name", "father_name", "last_name", "email",
                      "phone_num"],
                    
        "captain":   ["first_name", "father_name", "last_name", "phone_num",
                      "city", "school", "grade"],
                    
        "teammate": ["first_name", "father_name", "last_name", "city",
                      "school", "grade"],
                      
        "observer": ["first_name", "father_name", "last_name", "role"],
            
        "escort":    ["first_name", "father_name", "last_name", "phone_num",
                      "role"]
    };
    
    return required_fields[person_type];
}

function get_entered_fields(person)
{
    let fields_arr = [];
    
    for (let field in person)
    {
        if (field === "type") continue;
        if (person[field].length > 0) fields_arr.push(field);
    }
    
    return fields_arr;
}

function create_error_message(arr_persons)
{
    let types  = ["leader", "captain", "teammate", "observer", "escort"];
    let titles = ["Научные руководители", "Капитан команды", "Члены команды",
                  "Наблюдатели", "Сопровождающие"];
    
    let positions_names = ["должность", "класс", "класс", "роль", "роль"];
    
    let fields_names =
    {
        "photo"       : "фото",
        "first_name"  : "имя",
        "father_name" : "отчество (введите пробел, если отсутствует)",
        "last_name"   : "фамилия",
        "birthdate"   : "дата рождения",
        "email"       : "адрес почты",
        "phone_num"   : "номер телефона",
        "ref_to_vk"   : "ссылка на профиль ВК",
        "city"        : "город",
        "school"      : "номер или название школы",
        "position"    : "должность",
        "grade"       : "класс",
        "role"        : "роль"
    };
    
    let arr_typed_persons = types.map(type =>
    {
        return arr_persons.filter(type_is, type).map(person =>
        {
            return get_required_fields(person.type).filter(field =>
            {
                return (person[field].length == "");
            }, person);
        });
    }, arr_persons);
    
    let message = "";

    for (let i = 0; i < types.length; ++i)
    {
        let one_type_persons = arr_typed_persons[i]

        let type_is_empty = one_type_persons.every(person =>
        {
           return (person.length === 0); 
        });
        
        if (type_is_empty) continue;
        
        message += "\n\n" + titles[i] + ":";
        
        for (let j = 0; j < one_type_persons.length; ++j)
        {
            message += "\n" + (j+1) + ")";
            if (one_type_persons[j].length === 0)
            {
                message += " всё заполнено";
            }
            else
            {
                for (let k = 0; k < one_type_persons[j].length; ++k)
                {
                    message += " " + fields_names[one_type_persons[j][k]] + ";";
                }
            }
        }
    }
    
    if (message !== "")
    {
        message = "У некоторых людей не заполнены обязательные поля." + message;
    }
    
    return message;
}

function person_not_empty(person)
{
    return (get_entered_fields(person).length > 0);
}

function all_right(data)
{
    if (data.team.name.length     === 0 ||
        data.team.solution.length === 0 ||
        data.team.photo.length    === 0  )
    {
        alert("Проверьте, что вы ввели название команды, загрузили " + 
              "решение задачи в формате pdf и общую фотографию.");
        return;
    }
    
    data.persons = data.persons.filter(person_not_empty);
    
    if (data.persons.filter(type_is, "leader").length   < 1 ||
        data.persons.filter(type_is, "captain").length  < 1 ||
        data.persons.filter(type_is, "teammate").length < 2  )
    {
        alert("У команды должен быть хотя один научный руководитель " +
              "и не менее трёх членов команды, включая капитана.");
        return false;
    };
    
    // Вывести сообщение о незаполненных обязательных полях
    let message = create_error_message(data.persons);
    if (message !== "")
    {
        alert(message);
        return false;
    };
    
    // Вывести сообщение о неправильно заполненных полях
    
    return true;                
}

function person_to_text(str, person, i)
{
    str += (i + 1) + ")";
    
    for (let field in person)
    {
        if ((field === "type") || (field === "photo")) continue;
        str += " " + person[field] + ";"; 
    }
    
    return (str + "\n");
}

function type_is(person)
{
    return (person.type == this);
}

function data_to_text(data)
{
    let types  = ["leader", "captain", "teammate", "observer", "escort"];
    let titles = ["Научные руководители", "Капитан команды", "Члены команды",
                  "Наблюдатели", "Сопровождающие"];
 
    let str = "«" + data.team.name + "»\n" + types.reduce((str, type, i) =>
    {
       return (str + "\n" + titles[i] + ":\n" +
               data.persons.filter(type_is, type).reduce(person_to_text, ""));
    }, "");
    
    return str;
}

async function read_data()
{
    let info_inputs  = document.getElementsByClassName('team-info')[0]
                               .getElementsByTagName('input');
    let leads_inputs = get_arr_inputs_by_class('leaders');
    let teams_inputs = get_arr_inputs_by_class('teammates');
    let obsrs_inputs = get_arr_inputs_by_class('observers');

    let team_data  = await arr_inputs_to_obj_data(info_inputs);
    let leads_objs = await arr_inputs_to_arr_objs(leads_inputs, "leader");
    let teams_objs = await arr_inputs_to_arr_objs(teams_inputs, "teammate");
    let obsrs_objs = await arr_inputs_to_arr_objs(obsrs_inputs, "observer");
    
    let obj     = {};
    obj.team    = team_data;
    obj.persons = [].concat(leads_objs, teams_objs, obsrs_objs);;
    
    return obj;
}

class Attachment
{
    constructor(name, file, type)
    {
        attachment.Name          = name;
        attachment.Content       = file;
        attachment.ContentId     = null;
        attachment.ContentType   = type;
        attachment.CustomHeaders = null;
    }
}

function data_to_attachments(data)
{
    let arr_attachments = [];
    
    let obj_files =
    {
        "Решение": data.team.solution,
        "Общая фотография": data.team.photo
    };
    
    for (let i = 0; i < data.persons.length; ++i)
    {
        let file = data.persons[i].photo;
        if (file.length > 0)
        {
            obj_files[data.persons[i].last_name] = file;  
        };
    }
    
    for (let name in obj_files)
    {
        let file = obj_files[name];
        let type = file.slice(5, file.indexOf(";"));
        file = file.slice(file.indexOf(",")+1);
        arr_attachments.push(new Attachment(name, file, type));
    }
    
    return arr_attachments;
}

async function send_form()
{
    let data = await read_data();
    if (! all_right(data)) return;
    
    let from = {};
    from.EmailAddress = "mail@example.com";
    from.FriendlyName = null;
    
    let to = {};
    to.EmailAddress = "mail@example.com";
    to.FriendlyName = null;
    
    let message = {};
    message.From           = from;
    message.To             = [to];
    message.Subject        = "Регистрация команды «" + data.team.name + "»";
    message.TextBody       = data_to_text(data);
    message.Attachments    = data_to_attachments(data);
    message.HtmlBody       = null;
    message.ApiTemplate    = null;
    message.MailingId      = null;
    message.MessageId      = null;
    message.Charset        = null;
    message.CustomHeaders  = null;
    message.Cc             = null;
    message.Bcc            = null;
    message.ReplyTo        = null;
    message.MergeData      = null;
    
    let request = {};
    request.Messages = [message];
    
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", "send_mail.php");
    xmlhttp.send(JSON.stringify(request));
    xmlhttp.onreadystatechange = () =>
    {
        if (xmlhttp.readyState == 4)
        {
            if(xmlhttp.status == 200)
                alert(xmlhttp.responseText);
            else
                alert("При отпрвке формы произошла ошибка.");
        };
    }
}