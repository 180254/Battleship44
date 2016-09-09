package pl.nn44.battleship.controller;

import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Arrays;
import java.util.List;

@RequestMapping("/")
public class FrontController {

    private final List<String> supportedStringVersion =
            Arrays.asList("es6", "es6.min", "es5", "es5.min");

    @RequestMapping(value = {"/", "/index.html", "/index.htm"})
    public String index(@RequestParam(required = false, name = "v") final String scriptVersion,
                        Model model) {

        model.addAttribute("scriptVersion",
                scriptVersion != null && supportedStringVersion.contains(scriptVersion)
                        ? scriptVersion
                        : supportedStringVersion.get(0));

        return "index";
    }


}
