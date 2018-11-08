/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package cu.ult.entrega.util;

/**
 * Created by Nodo on 2/7/2017.
 */

public class Mensaje {
    private String status;
    private String msg;
    private boolean success;

    public Mensaje() {
    }

    public Mensaje(String status, String msg, boolean success) {
        this.status = status;
        this.msg = msg;
        this.success = success;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }
}
