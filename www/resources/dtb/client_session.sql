--------------------------------------------------------------------------------
DROP TABLE IF EXISTS DataSync;          --TABLA ANTIGUA, YA NO SE USA
DROP TABLE IF EXISTS InspectionBuffer;  --TABLA ANTIGUA, YA NO SE USA
--------------------------------------------------------------------------------
DROP TABLE IF EXISTS session;
CREATE TABLE session(name TEXT, value TEXT);
INSERT INTO session (name,value) VALUES ("updateDatabaseMobil","@UPDATE_DATABASE_MOBIL");
INSERT INTO session (name,value) VALUES ("connect","0");
INSERT INTO session (name,value) VALUES ("token","");
INSERT INTO session (name,value) VALUES ("idUser","");
INSERT INTO session (name,value) VALUES ("idCompany","");
INSERT INTO session (name,value) VALUES ("user","");
INSERT INTO session (name,value) VALUES ("namePerson","");
INSERT INTO session (name,value) VALUES ("profile","");
INSERT INTO session (name,value) VALUES ("dataSync","0");
--------------------------------------------------------------------------------
DROP TABLE IF EXISTS SyncDataStorage;
CREATE TABLE SyncDataStorage(
    total_storage INT,
    total_storage_used INT
);

DROP TABLE IF EXISTS SyncDataShip;
CREATE TABLE SyncDataShip(
    id INT,
    name TEXT,
    nombre TEXT,
    ais_callsign TEXT,
    dt_ship_yearbuilt TEXT,
    idShipSede INT,
    id_inventory_KinkShipOrSede INT,
    nu_ship_AB INT,
    nu_ship_HP INT,
    nu_ship_eslora INT,
    nu_ship_manga INT,
    nu_ship_puntal INT,
    tx_ship_bollardpull TEXT,
    tx_ship_registration TEXT,
    type TEXT
);

DROP TABLE IF EXISTS SyncDataBranch;
CREATE TABLE SyncDataBranch(id INT, name TEXT);

DROP TABLE IF EXISTS SyncDataCaptain;
CREATE TABLE SyncDataCaptain(id INT, name TEXT, id_inventory_CaptainAdminSede INT);

DROP TABLE IF EXISTS SyncDataPerson;
CREATE TABLE SyncDataPerson(
    id_user INT,
    NamePerson TEXT,
    NameProfile TEXT,
    CountEmail INT
);

DROP TABLE IF EXISTS SyncDataInspection;
CREATE TABLE SyncDataInspection(
    bo_inspsurvques_type INT,
    id_inspection INT,
    id_inspsurv INT,
    id_inspsurvques INT,
    id_inspsurvques_fk INT,
    id_mastertable_questype INT,
    nu_inspection_countsurv INT,
    nu_inspsurv_countques INT,
    nu_inspsurv_order INT,
    nu_inspsurv_weight INT,
    nu_inspsurvques_countquesopti INT,
    nu_inspsurvques_level INT,
    nu_inspsurvques_order INT,
    nu_inspsurvques_son INT,
    nu_inspsurvques_weight INT,
    tx_inpsurvques_comment TEXT,
    tx_inpsurvques_decription TEXT,
    tx_inspection_title TEXT,
    tx_inspsurv_description TEXT,
    tx_inspsurv_title TEXT
);

DROP TABLE IF EXISTS SyncDataInspectionType;
CREATE TABLE SyncDataInspectionType(id INT,name TEXT);


DROP TABLE IF EXISTS SyncDataInspectionUser;
CREATE TABLE SyncDataInspectionUser(
    bo_inspuser_state INT,
    bo_inspusersurvques_answer_option INT,
    bo_inspusersurvques_apply INT,
    captain_name TEXT,
    dt_inspuser_end TEXT,
    dt_inspuser_start TEXT,
    id_inspsurv INT,
    id_inspsurvques INT,
    id_inspsurvques_fk INT,
    id_inspuser INT,
    id_inspusersurv INT,
    id_inspusersurvques INT,
    id_inspusersurvques_fk INT,
    id_mastertable_questype INT,
    key_inspuser TEXT,
    nu_inspsurv_countques INT,
    nu_inspsurv_countquesrespon INT,
    nu_inspsurvques_level INT,
    nu_inspsurvques_order INT,
    nu_inspsurvques_son INT,
    nu_inspsurvques_weight INT,
    nu_inspusersurvques_countfile INT,
    nu_inspusersurvques_score INT,
    ship_name TEXT,
    tx_inpsurvques_comment TEXT,
    tx_inpsurvques_decription TEXT,
    tx_inspection_title TEXT,
    tx_inspsurv_title TEXT,
    tx_inspusersurvques_answer_observation TEXT,
    tx_inspusersurvques_latitud TEXT,
    tx_inspusersurvques_longitud TEXT
);

DROP TABLE IF EXISTS SyncDataSyncDate;
CREATE TABLE SyncDataSyncDate(
    CuboInspection TEXT,
    CuboPerson TEXT,
    CuboSede TEXT,
    CuboShip TEXT,
    Cubofile TEXT,
    Cuboinspuser TEXT,
    Cuboinspuserresp TEXT,
    Cubouserstorage TEXT
);

DROP TABLE IF EXISTS SyncDataImagesFileQuestion;
CREATE TABLE SyncDataImagesFileQuestion(
    id_inspuser INT,
    id_inspusersurvques INT,
    id_inspusersurvquesfile INT,
    inspusersurvquesfile_name TEXT,
    inspusersurvquesfile_url TEXT
);

DROP TABLE IF EXISTS SyncDataImagesContent;
CREATE TABLE SyncDataImagesContent(
    id INT,
    img TEXT
);


DROP TABLE IF EXISTS BufferInspectionCreate;
CREATE TABLE BufferInspectionCreate(
    id_inspuser INT,
    key_inspuser TEXT,
    id_inspection INT,
    id_ship INT,
    id_captain INT,
    id_branch INT,
    tx_ship TEXT,
    tx_captain TEXT,
    start TEXT,
    state INT
);

DROP TABLE IF EXISTS BufferInspectionSend;
CREATE TABLE BufferInspectionSend(
    id_inspuser INT,
    key_inspuser TEXT,
    id_inspection INT,
    resp_id_persons TEXT,
    resp_emails TEXT,
    end TEXT,
    state INT,
    send INT
);

DROP TABLE IF EXISTS BufferQuestionOption;
CREATE TABLE BufferQuestionOption(
    id_inspuser INT,
    key_inspuser TEXT,
    id_inspsurvques INT,
    nu_apply INT,
    nu_option INT,
    latitud TEXT,
    longitud TEXT,
    send INT
);

DROP TABLE IF EXISTS BufferQuestionPhoto;
CREATE TABLE BufferQuestionPhoto(
    id_inspuser INT,
    key_inspuser TEXT,
    id_inspsurvques INT,
    file TEXT,
    key_image TEXT,
    file_name TEXT,
    file_size TEXT,
    send INT
);

DROP TABLE IF EXISTS BufferQuestionObservation;
CREATE TABLE BufferQuestionObservation(
    id_inspuser INT,
    key_inspuser TEXT,
    id_inspsurvques INT,
    observation TEXT,
    send INT
);
