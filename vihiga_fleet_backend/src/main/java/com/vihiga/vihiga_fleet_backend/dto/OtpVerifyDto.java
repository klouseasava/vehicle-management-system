package com.vihiga.vihiga_fleet_backend.dto;

import lombok.Data;

@Data
public class OtpVerifyDto {
    private String email;
    private String code;
}