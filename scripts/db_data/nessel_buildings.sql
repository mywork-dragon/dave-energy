insert into buildings (name, address, company_id, sq_footage, zipcode, occupancy) values ('S.~33000Atrium', '3000 ATRIUM WAY', (select id from companies where name = 'Nessel'), 109151, 08054, 350);
insert into buildings (name, address, company_id, sq_footage, zipcode, occupancy) values ('S.~3701A', '701 ROUTE 73 S BLG1', (select id from companies where name = 'Nessel'), 93766, 08053, 300);
insert into buildings (name, address, company_id, sq_footage, zipcode, occupancy) values ('S.~3701C', '701 ROUTE 73 S BLG2', (select id from companies where name = 'Nessel'), 27802, 08053, 30);