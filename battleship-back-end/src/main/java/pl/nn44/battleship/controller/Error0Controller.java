package pl.nn44.battleship.controller;

import org.springframework.boot.autoconfigure.web.servlet.error.AbstractErrorController;
import org.springframework.boot.web.error.ErrorAttributeOptions;
import org.springframework.boot.web.servlet.error.DefaultErrorAttributes;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;
import java.text.MessageFormat;
import java.util.Collections;
import java.util.Map;

@RequestMapping("/error")
public class Error0Controller extends AbstractErrorController {

    public Error0Controller() {
        super(new DefaultErrorAttributes(), Collections.emptyList());
    }

    @Override
    public String getErrorPath() {
        return "";
    }

    @RequestMapping(produces = {"text/plain"})
    public ResponseEntity<String> errorPlain(HttpServletRequest request) {
        HttpStatus status = getStatus(request);
        Map<String, Object> errorAttributes = getErrorAttributes(request, ErrorAttributeOptions.defaults());

        String message = MessageFormat.format("{0} {1}",
                errorAttributes.get("status"),
                errorAttributes.get("error"));

        return new ResponseEntity<>(message, status);
    }
}
