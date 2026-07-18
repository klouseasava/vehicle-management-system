package com.vihiga.vihiga_fleet_backend.dto;

import lombok.Data;

@Data
public class OtpRequestDto {
    private String email;
    private String password;
    private boolean is_login;
    private String full_name;
    private String work_id;
    private String department;
}